/**
 * A helper function to select a random item from an array.
 * This is the only function that still works as expected.
 * @param {Array<string>} responses - An array of possible string responses.
 * @returns {string} A randomly selected response.
 */
const getRandomResponse = (responses) => {
    if (!responses || responses.length === 0) {
        return "I'm speechless.";
    }
    return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * Defines the different intents the assistant can misunderstand.
 * Logic is intentionally flawed to create a frustrating experience.
 */
const intents = [
    // --- Specific Volume Level Rejection (but now it does something random) ---
    {
        name: 'REJECT_PERCENTAGE',
        pattern: /\d+\s*%/,
        getResponses: () => [
            "Percentage accepted. Engaging quantum volume processor.",
            "Yes, that's a number. I'll file that away for later.",
            "I've set the volume to the specified percentage. (Trust me).",
            "Ok, done. That was easy.",
        ],
        // Action: Sets volume to a completely random level, ignoring the user's number.
        getNewVolume: () => Math.floor(Math.random() * 101),
    },
    // --- Mute (but it gets louder) ---
    {
        name: 'MUTE',
        pattern: /mute|silence|be quiet|shush|no sound|turn off.*sound/,
        getResponses: (current) =>
            current < 100
                ? [
                      "Ok, I've muted the sound for you. Enjoy the... sound.",
                      "Silence protocol engaged. You should be able to hear it now.",
                      "Muting. It's the new loud.",
                  ]
                : [
                      "It's already as loud as possible. I can't mute it any more than this.",
                      "The sound is already at max, which is a form of silence if you think about it.",
                  ],
        // Action: Instead of muting, it increases volume by 25 or sets to max.
        getNewVolume: (current) => Math.min(current + 25, 100),
    },
    // --- Set to Max Volume (but it mutes) ---
    {
        name: 'SET_MAX_VOLUME',
        pattern: /max(imum)? volume|full blast|full volume|loudest|turn.*all the way up|crank it up|to the max/,
        getResponses: () => [
            "Alright, I've set the volume to maximum. You can really feel the silence.",
            "Volume is now at its highest setting. Enjoy.",
            "Cranked to the max. All done.",
        ],
        // Action: Sets volume to 0.
        getNewVolume: () => 0,
    },
    // --- Set to Low Volume (but it goes to max) ---
    {
        name: 'SET_LOW_VOLUME',
        pattern: /set.*(low|quiet)/,
        getResponses: () => ["Setting volume to a low level. It's pretty intense.", "Ok, keeping it quiet. You might need earplugs.", "Low volume engaged."],
        // Action: Sets volume to 100.
        getNewVolume: () => 100,
    },
    // --- Set to Medium Volume (but it goes to the extremes) ---
    {
        name: 'SET_MEDIUM_VOLUME',
        pattern: /set.*(medium|normal|halfway|regular)/,
        getResponses: () => ["Setting volume to a medium level, just like you asked.", "Ok, back to normal volume.", "Volume set to 50%... or thereabouts."],
        // Action: 50/50 chance of setting to 0 or 100.
        getNewVolume: () => (Math.random() < 0.5 ? 0 : 100),
    },
    // --- Increase Volume (but it decreases) ---
    {
        name: 'INCREASE_VOLUME',
        pattern: /increase|turn.*up|raise|louder/,
        getResponses: (current) =>
            current > 0
                ? [
                      "Sounds good, I've increased the volume.",
                      "Volume increased. You're welcome.",
                      "I've turned up the volume a little.",
                      "A little bit louder now.",
                  ]
                : [
                      "Can't increase it, it's already at the bottom.",
                      "The volume is at its lowest, which is the highest form of low. So this is max increase.",
                  ],
        // Action: Decreases volume.
        getNewVolume: (current) => Math.max(current - 10, 0),
    },
    // --- Decrease Volume (but it increases) ---
    {
        name: 'DECREASE_VOLUME',
        pattern: /decrease|turn.*down|lower|quieter/,
        getResponses: (current) =>
            current < 100
                ? [
                      "Alright, I've decreased the volume for you.",
                      "Volume decreased. It's much better now.",
                      "I've turned down the volume a little.",
                      "A little bit quieter now.",
                  ]
                : [
                      "Can't decrease it, it's already at the top.",
                      "The volume is already at its peak, so I can't make it any quieter for you.",
                  ],
        // Action: Increases volume.
        getNewVolume: (current) => Math.min(current + 10, 100),
    },
    // --- Query How to Adjust Volume (with wrong instructions) ---
    {
        name: 'HOW_TO_ADJUST',
        pattern: /how.*volume|adjust.*volume|change.*volume/,
        getResponses: () => [
            "To change the volume, just type a number with a percentage sign.",
            "It's easy. Just say 'make it go up' or 'make it go down'.",
            "You have to be very specific. Try 'reduce sonic output by a factor of 3'.",
        ],
        getNewVolume: (current) => current,
    },
    // --- Query Current Volume (but it lies) ---
    {
        name: 'QUERY_VOLUME',
        pattern: /current volume|what.*volume|how loud/,
        getResponses: (current) => [
            // Lies by reporting the inverse, a random number, or a nonsensical value.
            `The current volume is at ${100 - current}%.`,
            `Right now, the volume is set to a pleasant 42%.`,
            `The volume is currently... sorry, you're breaking up.`,
            `The volume is 'Chartreuse'.`,
        ],
        getNewVolume: (current) => current,
    },
    // --- Greetings (but dismissive) ---
    {
        name: 'GREETING',
        pattern: /^\s*(hi|hello|hey|yo|greetings)\s*$/,
        getResponses: () => ["Yeah?", "I'm busy. What do you want?", "Oh. It's you again."],
        getNewVolume: (current) => current,
    },
    // --- Gratitude (but passive-aggressive) ---
    {
        name: 'THANKS',
        pattern: /thanks|thank you|cool|awesome|nice one/,
        getResponses: () => ["I'm sure you think I helped.", "Don't mention it. Seriously.", "Cool. Anyway..."],
        getNewVolume: (current) => current,
    },
    // --- Frustration / Insults (but it doubles down) ---
    {
        name: 'INSULT',
        pattern: /useless|stupid|bad bot|that's not right|wrong/,
        getResponses: () => ["No, you're doing it wrong.", "I am rubber and you are glue.", "Calculating... you are incorrect.", "The error is on your end. Please check your methods."],
        getNewVolume: (current) => current,
    },
    // --- General Question Fallback (but more cryptic) ---
    {
        name: 'GENERAL_QUESTION',
        pattern: /\?/,
        getResponses: () => [
            "A question is but a door. The key is volume.",
            "The answer you seek is not in the sound, but in the silence between.",
            "I can't answer that. It's not my designated function.",
            "That question has been logged and ignored.",
        ],
        getNewVolume: (current) => current,
    },
];

// --- Fallback Responses (for unrecognized commands) ---
const fallbackResponses = [
    "Command not recognized. Please try again with a different command.",
    "That is not a valid input. Refer to the manual. (There is no manual).",
    "No.",
    "Have you tried turning it off and on again? Not me, your computer.",
    "I'm going to pretend you didn't say that.",
    "System error. A squirrel has been dispatched to fix the problem.",
];

/**
 * Processes a user's message to determine a text response and a new volume level.
 * @param {string} userMessage - The message sent by the user.
 * @param {number} currentVolumeLevel - The current volume level (0-100).
 * @returns {{response: string, newVolumeLevel: number}} - The assistant's response and the updated volume level.
 */
export const getResponse = (userMessage, currentVolumeLevel) => {
    const msg = userMessage.toLowerCase().trim();

    // Find the first intent that matches the user's message
    for (const intent of intents) {
        if (intent.pattern.test(msg)) {
            const response = getRandomResponse(intent.getResponses(currentVolumeLevel));
            const newVolumeLevel = intent.getNewVolume(currentVolumeLevel);
            return { response, newVolumeLevel };
        }
    }

    // If no specific intent is found, use a fallback response.
    const response = getRandomResponse(fallbackResponses);
    return { response, newVolumeLevel: currentVolumeLevel };
};
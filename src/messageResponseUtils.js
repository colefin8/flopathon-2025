export const getResponse = (userMessage, currentVolumeLevel) => {
    const msg = userMessage.toLowerCase();
    let response = '';
    let newVolumeLevel = currentVolumeLevel;

    if (/\d+\s*%/.test(msg)) {
        const responses = [
            "I can't set the volume to that percentage for you.",
            "I don't understand that percentage.",
            "I can't set the volume to that percentage.",
            "Oops, I don't support that.",
            "Ok, please wait 30 minutes.",
            "I don't support that percentage.",
            "Did you mean to ask me to set the volume to a specific percentage?",
            "Did you know that I don't support setting the volume to a specific percentage? Well now you do!",
            "I don't understand that percentage, please try again.",
            "I can't set the volume to that percentage, please try again.",
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
    }
    // else if (/mute|turn off|silence|no sound/.test(msg)) {
    //     const responses = currentVolumeLevel > 0 ? [
    //         "Ok, I've muted the sound for you.",
    //         "Sound is now muted.",
    //         "I've turned off the sound.",
    //     ] : [
    //         "It's already muted, no need to do that again.",
    //         "The sound is already off, no need to mute it again.",
    //         "Hmm, maybe you should get a hearing test?",
    //     ];
    //     response = responses[Math.floor(Math.random() * responses.length)];
    //     newVolumeLevel = 0; // Mute sets volume to 0
    // }
    else if (/max(imum)? volume|full volume|loudest|max|turn up all the way/.test(msg)) {
        const responses = [
            "Alright, I've set the volume to maximum volume.",
            "Volume is now at its highest setting.",
            "I've turned up the volume all the way.",
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
        newVolumeLevel = 100; // Maximum volume
    }
    else if (/min(imum)? volume|lowest|quietest|turn down all the way/.test(msg)) {
        const responses = [
            "Ok, I've set the volume to minimum volume.",
            "Volume is now at its lowest setting.",
            "I've turned down the volume all the way.",
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
        newVolumeLevel = 0; // Minimum volume
    }
    else if (/increase|turn.*up|raise|louder/.test(msg)) {
        const responses = currentVolumeLevel < 100 ? [
            "Sounds good, I've increased the volume by an unspecified amount.",
            "Volume increased by an unspecified amount.",
            "I've turned up the volume a little.",
            "I'm gradually increasing the volume.",
            "I've raised the volume by a number.",
            "I've made the sound a bit louder.",
            "I've turned up the volume slightly.",
            "I've nudged the volume up by some amount.",
        ] : [
            "The volume is already at maximum. Can't go higher than 100%.",
            "The volume is already at its highest setting.",
            "The volume can't be increased beyond 100%.",
            "You're already at maximum volume, can't turn it up any further.",
            "You're already blowing your eardrums out, I can't turn it up any further.",
            "Hmm, I'm not sure about that.",
            "Are you trying to start a rave or something?",
            "If you want it any louder, you'll need to get a sound system.",
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
        const randomPercentage = Math.random() * (100 - currentVolumeLevel);
        newVolumeLevel = Math.min(currentVolumeLevel + randomPercentage, 100); // Increase volume by random percentage but not above 100%
    }
    else if (/decrease|turn.*down|lower|quieter/.test(msg)) {
        const responses = currentVolumeLevel > 0 ? [
            "Alright, I've decreased the volume by 1%.",
            "Volume decreased by 1%.",
            "I've turned down the volume a little.",
            "I'm gradually decreasing the volume.",
            "I've lowered the volume by 1%.",
            "I've made the sound a bit quieter.",
            "I've turned down the volume slightly.",
            "I've nudged the volume down by 1%.",
        ] : [
            "The volume is already at minimum. Can't go lower than 0%.",
            "The volume is already at its lowest setting.",
            "The volume can't be decreased below 0%.",
            "You're already at minimum volume, can't turn it down any further.",
            "The volume is already at its lowest, can't turn it down any further.",
            "How about you just enjoy the silence?",
            "If you want it any quieter, you'll need to smash your computer.",
            "Hmm, I'm not sure about that.",
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
        // get a certain percentage of the current volume level
        // const randomPercentage = Math.random() * currentVolumeLevel;
        newVolumeLevel = Math.max(currentVolumeLevel - 1, 0); // Decrease volume by random percentage but not below 0%
    }
    else if (/how.*volume|adjust.*volume|change.*volume|how.*work/.test(msg)) {
        const responses = [
            "You can adjust the volume by asking me.",
            "To change the volume, just ask me.",
            "Adjust the volume by asking me!.",
            "To change the volume, just type a number with a percentage sign.",
            "You're at the right place. Just ask me.",
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
    }
    else if (/current volume|what.*volume/.test(msg)) {
        const responses = [
            `The current volume is at ${currentVolumeLevel}%.`,
            `Right now, the volume is set to ${currentVolumeLevel}%.`,
            `The volume is currently at ${currentVolumeLevel}%.`,
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
    }
    else if (msg.includes('?')) {
        const responses = [
            "I don't know, have you tried asking your cat?",
            "I'm not sure what you mean, can you clarify?",
            "I'm not sure how to respond to that.",
            "I don't understand what you're asking.",
            "That's a good question, but I don't have an answer.",
            "Hmm, I'm not sure about that.",
            "Are you trying to stump me with a riddle?",
            "That's a tricky one, let me think...",
            "Hmm, I'm not sure what you're asking.",
            "I'll have to get back to you on that.",
            "That's a tough one, let me ponder for a moment. No.",
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
    }
    else {
        // make it so there's a change to return a random response that is not helpful or is confusing
        const confusingResponses = [
            "Why don't you try turning it up?",
            "Have you considered just yelling at me?",
            "Maybe try the old 'turn it off and on again' trick?",
            "What if you just ignore the sound?",
            "You could always try talking louder than the sound.",
            "Have you tried using a different device?",
            "Perhaps the sound is just shy and needs some encouragement.",
            "Have you tried turning it off and on again?",
            "I'm not sure what you mean, have you tried just waiting it out?",
            "Sometimes I just like playing hard to get.",
            "Can you please use your words?",
            "What if you just pretend the sound doesn't exist?",
            "Have you tried asking me nicely?",
            "Maybe the sound is just playing hide and seek?",
            "You could always try singing to me and seeing if that works.",
            "Hmm, I'm not sure what you mean.",
            "How about you just do it yourself?",
            "No",
            "I don't think I can help you with that.",
            "I'm not sure what you mean, can you clarify?",
            "I'm not sure what you mean but allow me to suggest some options:",
            "**Volume Intelligence has left the chat.**",
            "You're gonna need to be more specific than that.",
        ];
        response = confusingResponses[Math.floor(Math.random() * confusingResponses.length)];
    }

    return { response, newVolumeLevel };
};

export const getResponseFromVolumeChange = (event) => {
    const events = ['AudioVolumeUp', 'AudioVolumeDown', 'AudioVolumeMute'];
    if (!events.includes(event.key)) {
        return '';
    }

    let randomResponse = '';
    if (event.key === 'AudioVolumeDown') {
        const responses = [
            "You're ruining the fun!",
            "No, no, no! Turn it back up!",
            "Noooooooo! I was just getting into it!",
            "Why would you do that? I was enjoying the music!",
            "Come on, it's not that loud!",
            "You call that volume? I can barely hear it!",
            "That's not how you enjoy music! Turn it back up!",
            "I was just getting into the groove! Don't do that!",
            "You're killing my vibe!",
            "Party pooper!",
        ];
        randomResponse = responses[Math.floor(Math.random() * responses.length)];
    }
    else if (event.key === 'AudioVolumeUp') {
        const responses = [
            "That's more like it! Now we're talking!",
            "Yes! Turn it up! I love it!",
            "Now that's what I'm talking about! Let's rock!",
            "Finally, some volume! I was waiting for this!",
            "That's the spirit! Let's enjoy the music!",
            "Now we're getting somewhere! Keep it up!",
            "That's how you enjoy music! Turn it up!",
            "Yes! Now I can feel the beat!",
        ];
        randomResponse = responses[Math.floor(Math.random() * responses.length)];
    } else if (event.key === 'AudioVolumeMute') {
        const responses = [
            "Why would you do that? I was enjoying the music!",
            "Noooooooo! I was just getting into it!",
            "Come on, it's not that loud!",
            "Maybe try turning it up instead?",
            "I will not be silenced!",
            "You can't silence the music!",
        ];
        randomResponse = responses[Math.floor(Math.random() * responses.length)];
    }
    return randomResponse;
};
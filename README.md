# Flopathon-2025

[link here](https://flopathon-2025.netlify.app/)

This repository is for Awardco's 2025 Flopathon. It contains a Vue 3 project powered by Vite with Vue Router, Pinia state management, and Vitest for unit testing.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Getting Started

1. Clone the repository

```sh
git clone https://github.com/colefin8/flopathon-2025.git
cd flopathon-2025
```

2. Install dependencies

```sh
npm install
```

3. Start the development server

```sh
npm run dev
```

## Contributing

Each team should follow these steps to contribute:

1. Create a branch off of master with your team name

```sh
git checkout -b team-name
```

2. Rename the Vue component "RenameMe.vue" in `src/components/` with your team name

3. The routes and navigation dynamically generated!

   - Routes are automatically created based on the component filename
   - A route for `TeamAwesome.vue` will be `/team-awesome`
   - Navigation links are automatically added to the header

4. Implement your volume selector UI in your component

5. Open a pull request so we can merge them all in for presenting.

### How the Dynamic Routing Works

- Any `.vue` file in the `src/components/` directory (except HomeView.vue) will automatically get:
  - A route based on the kebab-case version of the filename (e.g., `TeamAwesome.vue` → `/team-awesome`)
  - A navigation link in the header with spaces between words (e.g., `TeamAwesome` → `Team Awesome`)
- No manual route configuration needed
- No need to modify `App.vue` or `router/index.js`

## Prompt

You will be creating a UI component to select a value for the volume of a piece of media. You do not have to make the component actually change the volume of a `<video>` or `<audio>` tag, just a UI that provides some way of selecting a value between 1-100. Whether it be actually possible, eventually possible, or only theoretically possible it doesn't matter.

## Judging Criteria

To quote Kwan's message in #prod-dev-announcements, the categories are as follows:

**Most Hated:** Can you craft something so frustrating it makes users scream? Show us your worst!

**Hardest to Use:** Simplicity is for suckers! Let's see your labyrinthine layouts!

**People's Choice:** The crowd decides which "flop" truly stole their hearts (and perhaps their sanity)!

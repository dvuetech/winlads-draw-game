# Claw Machine Game

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Overview

This project is a Claw Machine Game that provides a seamless way to conduct giveaway draws using Phaser.js. It integrates data from external services to ensure a fair and transparent drawing process. The system allows administrators to load entries and giveaway details, visualizing the draw in an engaging manner for participants.

## Features

- **Fair and Transparent Raffle Draws**: All entries are fetched dynamically and verified before the draw begins.
- **Phaser-based Visualization**: The draw is rendered using Phaser.js for smooth and interactive graphics.
- **Integration with External Services**: Fetches giveaway and entry data using pre-defined APIs.

## Dependencies

This project uses the following dependencies:

- **`@types/node`**: TypeScript definitions for Node.js (v20.5.9)  
- **`@types/react`**: TypeScript definitions for React (v18.2.21)  
- **`@types/react-dom`**: TypeScript definitions for React DOM (v18.2.7)  
- **`autoprefixer`**: Adds vendor prefixes to CSS (v10.4.15)  
- **`axios`**: HTTP client for API requests (^1.7.7)  
- **`eslint`**: Pluggable JavaScript linter (v8.48.0)  
- **`eslint-config-next`**: ESLint configuration for Next.js (v13.4.19)  
- **`next`**: React framework for production (v13.4.19)  
- **`phaser`**: 2D game framework (^3.60.0)  
- **`postcss`**: CSS transformer (v8.4.29)  
- **`react`**: JavaScript library for building user interfaces (v18.2.0)  
- **`react-dom`**: React DOM library (v18.2.0)  
- **`tailwindcss`**: CSS framework for styling (v3.3.3)  
- **`typescript`**: JavaScript with static typing (v5.2.2)  

## Choosing a Winner

### The winner selection process involves the following steps:

1. Creating a Weighted Array: An array is generated where each participant's user ID is repeated according to their points value, with previous winners excluded to ensure fairness.
2. Shuffling the Array: The array is shuffled randomly to ensure that the process is unbiased.
3. Selecting a Random Winner: A random index is chosen from the shuffled array to select the winner.
4. Updating the Winner's Points: The winner's points are decremented, reducing their chances in future draws.
5. Promise Resolution: The winner's user ID is resolved asynchronously, enabling integration with other processes.

### Key Features of the Winner Selection Process

- Weighted Randomness: Participants with more points have a higher chance of being selected.
- Exclusion of Previous Winners: Ensures fairness by excluding participants who have already won.
- Dynamic Point Management: Adjusts participant points after each draw to maintain fairness.
- Randomness with Integrity: The shuffling process and random index selection ensure unbiased outcomes.

## Setup and Usage

### Prerequisites

- Node.js (version 16 or higher)
- Yarn (preferred package manager)

### Installation

Clone the repository:
```bash
git clone https://github.com/yourusername/winlads-draw-game.git
cd winlads-draw-game
```
Install dependencies:
```bash
yarn install
```

### Environment Setup

Create a .env file in the root directory and add the following variables:

```bash
NEXT_PUBLIC_BASE_URL=your_base_url_here
NEXT_PUBLIC_API_KEY=your_api_key_here
```

### Running the Application

Start the development server:
```bash
yarn dev
```
### Usage

Pass the following query parameters in the URL:

- accessToken: The access token for API authentication.
- winUrl: The base URL for the winner submission API.
- adminUrl: The admin API base URL.
- giveawayId: The unique identifier for the giveaway.

Example:
```bash
http://localhost:3000/game?accessToken=abc123&winUrl=https://winurl.com&adminUrl=https://adminurl.com&giveawayId=12345
```
The system will validate the parameters and fetch the required data to initialize the draw.

## Contribution Guidelines

We welcome contributions to this project! Follow these steps to get involved:

1. Fork the repository to your GitHub account and clone it locally.
2. Create a new branch for your feature or bugfix:

   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes and push to your fork:
   
   ```bash
   git add .
   git commit -m "Add new feature"
   git push origin feature-name
   ```
   
4. Open a pull request on the main repository.

Please ensure all contributions:

- Adhere to the existing code style.
- Include necessary comments and documentation.
- Pass all tests before submission.

## License

This project is licensed under the MIT License. You are free to use, modify, and distribute this project with proper attribution.


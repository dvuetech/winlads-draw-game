# Claw Machine Game

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

### The winner selection process is designed to be transparent, fair, and auditable. It follows these key steps:

1. Creating a Weighted Array:
- An array is generated where each participant's user ID is repeated according to their points value. This means that participants with more points have a higher chance of being selected. Importantly, previous winners are excluded from the draw to ensure fairness and prevent duplicate winners.
- Transparency: The logic behind the weighted array ensures that participants' chances are proportional to their points, and no one is unfairly excluded or favored.

2. Shuffling the Array:

- The array is shuffled randomly to ensure that the process remains unbiased. The shuffle is a critical step in maintaining randomness and ensuring that all participants, based on their weighted chances, have an equal opportunity to win.
- Fairness: The shuffling process, combined with the random selection, eliminates any potential for skewing or bias in the draw. However, to further enhance fairness, you could consider integrating a cryptographic random number generator (RNG), which guarantees higher levels of unpredictability and security.

3. Selecting a Random Winner:

- After the array is shuffled, a random index is chosen, and the corresponding user ID is selected as the winner. This ensures that the winner is selected purely by chance.
- Randomness with Integrity: To ensure the integrity of randomness, the algorithm used is a proven randomization method (Phaser.js’s Phaser.Math.Between). For added transparency, the use of a cryptographic RNG can be considered to further guarantee fairness.

4. Updating the Winner's Points:

- Once the winner is selected, their points are decremented, reducing their chances in subsequent draws. This ensures that each winner has a diminished chance of winning in future draws, contributing to the fairness of ongoing raffle processes.
- Dynamic Point Management: After each draw, adjusting the participant’s points reflects a dynamic and evolving process that ensures no participant can dominate the raffle process.

5. Promise Resolution:

- The winner's user ID is resolved asynchronously, allowing the system to integrate with other processes and ensure that the winner’s information is used in other stages of the giveaway or raffle process.
- Auditability: To ensure the draw’s fairness, logs and hashes can be included, allowing anyone to verify the steps taken in the selection process. Logs can be maintained for every step, including the creation of the weighted array, the shuffle process, and the final winner selection. These logs should be made publicly available or easily accessible for audit purposes.


### Key Features of the Winner Selection Process

- Weighted Randomness: Participants with more points have a higher chance of being selected, and their participation is based on a transparent, fair, and auditable system.
- Exclusion of Previous Winners: Previous winners are excluded to ensure fairness and prevent any participant from winning multiple times in a single draw.
- Dynamic Point Management: After each draw, the points are updated, ensuring that each participant's chances are managed fairly for future draws.
- Randomness with Integrity: The shuffling process and random index selection ensure unbiased outcomes. To further enhance fairness, a cryptographic RNG can be integrated to achieve a higher level of security and randomness.
- Transparency and Auditability: Logs, hashes, and other forms of verification can be provided to prove the fairness of the draw and allow anyone to review the process for integrity.



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


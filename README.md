# Raffle Draw System

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Overview

This project is a raffle draw system that provides a seamless way to conduct giveaway draws using Phaser.js. It integrates data from external services to ensure a fair and transparent drawing process. The system allows administrators to load entries and giveaway details, visualizing the draw in an engaging manner for participants.

## Features

- **Fair and Transparent Raffle Draws**: All entries are fetched dynamically and verified before the draw begins.
- **Phaser-based Visualization**: The draw is rendered using Phaser.js for smooth and interactive graphics.
- **Integration with External Services**: Fetches giveaway and entry data using pre-defined APIs.

## Setup and Usage

### Prerequisites

- Node.js (version 16 or higher)
- Yarn (preferred package manager)

### Installation

Clone the repository:
```bash
git clone https://github.com/yourusername/raffle-draw-system.git
cd raffle-draw-system
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



## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

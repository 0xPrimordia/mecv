# MeCV: Code Proficiency Evaluation Tool

MeCV is an advanced tool designed to evaluate a user's coding proficiency based on the functions and patterns used in their code. It aims to replace traditional technical interviews by providing a detailed analysis of a developer's skills. Users can claim their profiles and access advanced features like customization and detailed skill analysis.

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- Node.js (v14 or higher)
- npm (v6 or higher) or yarn (v1.22 or higher)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/mecv.git
   cd mecv
   ```

2. **Install dependencies:**
   Using npm:
   ```bash
   npm install
   ```
   Or using yarn:
   ```bash
   yarn install
   ```

### Running the Development Server

To start the development server, run:

```
bash
npm run dev
or
yarn dev
or
pnpm dev
or
bun dev
```



### Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables:

```
NEXT_PUBLIC_GITHUB_TOKEN=your_github_token
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
```




Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Project Structure

- **`src/app/page.tsx`**: Main page component where users can input their GitHub username and repository to evaluate their code proficiency.
- **`src/app/api/evaluate/route.ts`**: API route to evaluate the repository and classify the user's proficiency.
- **`src/app/utils/githubApi.tsx`**: Utility functions to interact with the GitHub API.
- **`src/app/utils/classifyRepo.js`**: Functions to classify the repository based on detected patterns.
- **`src/app/patterns`**: Directory containing pattern detection logic for different programming languages.

### Usage

1. **Evaluate a Repository:**
   - Enter a valid GitHub username and select a repository to evaluate.
   - Click on the "Evaluate" button to get the proficiency analysis.

2. **Claim Your Profile:**
   - Sign in with your GitHub account.
   - Customize your profile and access advanced features like detailed skill analysis and commit history scanning.

### Learn More

To learn more about Next.js, take a look at the following resources:
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Contributing

We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to reach out if you have any questions or need further assistance. Happy coding!
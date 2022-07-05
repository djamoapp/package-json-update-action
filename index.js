const core = require('@actions/core');
const { context } = require('@actions/github');
const { execSync } = require('child_process')

const main = async () => {
    try {
        const tag = core.getInput('tag', { required: true });
        const branch = core.getInput('branch', { required: true });

        const { owner: currentOwner, repo: currentRepo } = context.repo;

        const commitMessage = `chore(release): ${tag}`;
        core.info(`commit message is: [${commitMessage}]`);

        let newPackageVersion = execSync(`npm version --git-tag-version=false ${tag}`).toString().trim();
        core.info(`new package version is: [${newPackageVersion}]`);

        execSync(`git config --global user.email "ping@djamo.io"`).toString().trim();
        execSync(`git config --global user.name "${currentOwner}"`).toString().trim();

        execSync(`git add .`).toString().trim();
        execSync(`git commit -am "${commitMessage}"`).toString().trim();
        execSync(`git push origin HEAD:refs/heads/${branch}`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

// Call the main function to run the action
main();
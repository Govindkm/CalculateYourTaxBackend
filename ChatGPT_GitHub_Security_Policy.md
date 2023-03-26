## You

Hi I want to add security policy to my master branch in GitHub. It is a public repository and I want to allow 2 reviewers to review before merging. No direct commits should be allowed on master branch.

## Genie

Hello, to add security policy to your master branch in GitHub, you can follow the below steps:

1. Go to the 'Settings' tab of your repository.
2. Click on 'Branches' from the left sidebar.
3. Under 'Branch Protection Rules,' click on 'Add rule.'
4. In the 'Branch name pattern' field, type 'master' without quotes.
5. Check the box for 'Require pull request reviews before merging.' 
6. Set the number of required reviewers to 2.
7. Check the box for 'Dismiss stale pull request approvals when new commits are pushed'.
8. Check the box for 'Include administrators'.
9. Under 'Restrictions' check the box for 'Restrict who can push to matching branches'.
10. Select the option 'Include the following people or teams', and then add the two reviewers who you want to allow to review before merging.
11. Uncheck the box for 'Allow direct pushes to master branch'.

After completing these steps, no one will be able to directly commit changes to the master branch, and any changes will need to be submitted via pull request. The pull requests will require approval from at least 2 reviewers before it can be merged into the master branch.
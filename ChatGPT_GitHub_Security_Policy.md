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

## You

How to restrict merge if unit tests are not passing

## Genie

To restrict merge if unit tests are not passing, you can use GitHub Actions. Here are the steps:

1. Create a new GitHub action workflow file in `.github/workflows` directory of your repository. For example: `.github/workflows/test-on-push.yml`

2. Use the `on push` trigger to run the workflow whenever someone pushes changes to the master branch.

```
on:
  push:
    branches: [ master ]
```

3. Create a job in the workflow that runs the unit tests using a testing framework of your choice. You can use a pre-defined Github Action or create your own.

Example:

```
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies and run tests
        run: |
          yarn
          yarn test
```

4. Add an `if` condition to the deployment job that checks if the tests have passed. If the tests have failed, the condition will prevent the deployment step from running.

Example:

```
jobs:
  test:
    # ...
    
  deploy:
    needs: test
    if: success()
    # Deployment steps...
```

5. Commit and push the workflow file to your repository.

Now, whenever someone pushes changes to the master branch, this GitHub Action will automatically run the unit tests. If the tests fail, the deployment job will not be run, preventing anyone from merging changes into the master branch until the issue is fixed.
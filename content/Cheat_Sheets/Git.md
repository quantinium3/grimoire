---
id: Git
aliases: []
tags: []
description: A cheatsheet for most used git commands
title: Git
---

### Create ssh key and link it to github
| command | Description |
| ---- | ---- |
| ssh-keygen -t ed25519 -C "your_email@example.com" | You can also specify a different key type by replacing rsa with ed25519 or ecdsa if you prefer. |
|  |  |
- Now go to the location where the saved  ssh key is. by default at ~/.ssh/.it'll be named id_ed25519.pub. Depending upon the type of key it may be difficult.
- Copy it and go to your Github.
- Go to settings/SSH and GPG keys. Click on new ssh key and paste it.

Run
~~~
$ git config --global user.email "you@example.com"
$ git config --global user.name "Your Name"
~~~

to set your account's default identity.
Omit `--global` to set the identity only in this repository.

### **Git Commands**

| Command | Decription |
| --------------------------------------------------------------------- | --------------------------------- |
| `git init`                                                            | Initialize a local Git repository |
| `git clone ssh://git@github.com/[username]/[repository-name].git`     | Create a local copy of a remote repository |
| `git status`                                                          | Check status |
| `git add [file-name.txt]`                                             | Add a file to the staging area |
| `git add -A`                                                          | Add all new and changed files to the staging area |
| `git commit -m "[commit message]"`                                    | Commit changes |
| `git rm -r [file-name.txt]`                                           | Remove a file (or folder) |
| `git branch`                                                          | List branches (the asterisk denotes the current branch) |
| `git branch -a`                                                       | List all branches (local and remote) |
| `git branch [branch name]`                                            | Create a new branch |
| `git branch -d [branch name]`                                         | Delete a branch |
| `git push origin --delete [branch name]`                              | Delete a remote branch |
| `git checkout -b [branch name]`                                       | Create a new branch and switch to it |
| `git checkout -b [branch name] origin/[branch name]`                  | Clone a remote branch and switch to it |
| `git branch -m [old branch name] [new branch name]`                   | Rename a local branch |
| `git checkout [branch name]`                                          | Switch to a branch |
| `git checkout -`                                                      | Switch to the branch last checked out |
| `git checkout -- [file-name.txt]`                                     | Discard changes to a file |
| `git merge [branch name]`                                             | Merge a branch into the active branch |
| `git merge [source branch] [target branch]`                           | Merge a branch into a target branch |
| `git stash`                                                           | Stash changes in a dirty working directory |
| `git stash clear`                                                     | Remove all stashed entries |
| `git push origin [branch name]`                                       | Push a branch to your remote repository |
| `git push -u origin [branch name]`                                    | Push changes to remote repository (and remember the branch) |
| `git push`                                                            | Push changes to remote repository (remembered branch) |
| `git push origin --delete [branch name]`                               | Delete a remote branch |
| `git pull`                                                            | Update local repository to the newest commit |
| `git pull origin [branch name]`                                       | Pull changes from remote repository |
| `git remote add origin ssh://git@github.com/[username]/[repository-name].git` | Add a remote repository |
| `git remote set-url origin ssh://git@github.com/[username]/[repository-name].git` | Set a repository's origin branch to SSH |
| `git log`                                                             | View changes |
| `git log --summary`                                                   | View changes (detailed) |
| `git log --oneline`                                                   | View changes (briefly) |
| `git diff [source branch] [target branch]`                            | Preview changes before merging |

### *gh repo commands*
`gh repo create [<name>] [flags]`

| command | Decription |
| ----------------------------------| ----------------------------------------------|
| `--add-readme`                    | Add a README file to the new repository        |
| `-c, --clone`                     | Clone the new repository to the current directory |
| `-d, --description <string>`      | Description of the repository                  |
| `--disable-issues`                | Disable issues in the new repository          |
| `--disable-wiki`                  | Disable wiki in the new repository            |
| `-g, --gitignore <string>`        | Specify a gitignore template for the repository |
| `-h, --homepage <URL>`            | Repository home page URL                      |
| `--include-all-branches`          | Include all branches from template repository |
| `--internal`                      | Make the new repository internal              |
| `-l, --license <string>`          | Specify an Open Source License for the repository |
| `--private`                       | Make the new repository private               |
| `--public`                        | Make the new repository public                |
| `--push`                          | Push local commits to the new repository      |
| `-r, --remote <string>`           | Specify remote name for the new repository    |
| `-s, --source <string>`           | Specify path to local repository to use as source |
| `-t, --team <name>`               | The name of the organization team to be granted access |
| `-p, --template <repository>`     | Make the new repository based on a template repository |

Changes made:
1. Aligned the table headers and content properly using consistent spacing
2. Added proper separators (`|`) between columns
3. Fixed the alignment of flags and their descriptions
4. Added a blank description for the main command to maintain table structure
5. Ensured consistent formatting of flags (with proper spacing around dashes)

Examples

- create a repository interactively
`gh repo create`

- create a new remote repository and clone it locally
`gh repo create my-project --public --clone`

- create a remote repository from the current directory
`gh repo create my-project --private --source=. --remote=upstream`

More Commands: 
[git-docs](https://git-scm.com/docs/git)
[gh repo](https://cli.github.com/manual/gh_repo)

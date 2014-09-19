---
title: Git Rebase Workflow
date: 2014-09-18
---

This isn't an in-depth analysis of the benefits of a squash/rebase workflow. I prefer the `rebase` workflow over the `merge` workflow because it tends to result in a very clean, easy-to-read Git history. Some people prefer a merge workflow. Either is a totally valid approach, and there are plenty of excellent comparisons out there.<sup>[1](#1)</sup>

Instead, this post is a summary of what you need to know to use a squash/rebase workflow, some common pitfalls, and insight into what each each command is actually doing.


### Pulling in Upstream Changes

First, you'll want to make sure that your repository has two remotes; one named `origin`, and one named `upstream`. The `upstream` remote should point at the canonical repository (not your fork).

Next, make sure your code is up to date with the canonical repository by fetching from upstream and rebasing it into your current branch:

```sh
git checkout master
git fetch upstream
git rebase upstream/master
```

Resolve conflicts (if any) and your code should now be up to date. Alternatively, you can pass `git pull` the `--rebase` flag to merge in upstream changes:

```sh
git pull --rebase upstream master
```


### Squashing a Feature Branch Into One Commit

#####[Skip to the tl;dr](#squash-tldr)

When using the squash workflow, before submitting a pull request you'll want to compress all the commits in your feature branch down into one commit. This is known as a *squash commit*.

We'll start by refreshing from upstream and starting the rebase commit:

```sh
git fetch upstream
git checkout your-feature-branch
git rebase -i upstream/master
```

This will do two things: Merge in any changes from upstream that are not yet present in your branch, and start an interactive rebase. You should see a list of commits that are present on your local branch but are not present upstream.

```git
pick 40d4ec1 Add contributing docs
pick b4514ff Update readme with installation instructions
pick 8690cd0 Add changelog

# Rebase dc82960..8690cd0 onto dc82960
#
# Commands:
#  p, pick = use commit
#  r, reword = use commit, but edit the commit message
#  e, edit = use commit, but stop for amending
#  s, squash = use commit, but meld into previous commit
#  f, fixup = like "squash", but discard this commit's log message
#  x, exec = run command (the rest of the line) using shell
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out
```

We want to change our oldest commit's message to a summary of our pull request, and then squash all the other commits onto that commit:

```git
pick 40d4ec1 Add contributing docs
squash b4514ff Update readme with installation instructions
squash 8690cd0 Add changelog

# Rebase dc82960..8690cd0 onto dc82960
#
# Commands:
#  p, pick = use commit
#  r, reword = use commit, but edit the commit message
#  e, edit = use commit, but stop for amending
#  s, squash = use commit, but meld into previous commit
#  f, fixup = like "squash", but discard this commit's log message
#  x, exec = run command (the rest of the line) using shell
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out
```

Here, Git sees our commits marked `squash` and combines them all into `40d4ec1`.

Now we get the opportunity to edit our commit message.

```git
# This is a combination of 3 commits.
# The first commit's message is:
Add contributing docs

# This is the 2nd commit message:

Update readme with installation instructions

# This is the 3rd commit message:

Add changelog

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
# rebase in progress; onto dc82960
# You are currently editing a commit while rebasing branch 'master' on 'dc82960'.
#
# Changes to be committed:
# new file:   CHANGELOG.md
# new file:   CONTRIBUTING.md
# modified:   README.md
#
```

You've now squashed your feature branch down into one single commit composed of the changes in all three commits. You can now push your branch up and put in a pull request, and your changes will be contained within a single commit.

Note that if you've already pushed this branch, you'll need to force push with `git push -f`. Rebasing rewrites your commit history, meaning your local Git history will have diverged from your remote history; as such, you'll need to tell your Git server it's okay to accept these changes.

#### Summary<a id="squash-tldr"></a>

```sh
git fetch upstream
git checkout your-feature-branch
git rebase -i upstream/master
```


### Reverting a Rebase 

#####[Skip to the tl;dr](#revert-rebase-tldr)

The flipside to rebasing down to a single commit is that if you mess things up, undoing them can sometimes be a little difficult.

Sometimes, in the middle of a rebase you'll realize that you edited the wrong commits, hit save before you finished typing out your commit message, or messed up some merge conflicts during your rebase. Luckily, reverting a rebase is pretty easy, thanks to Git's [`reflog`][reflog] command.

First, we'll run `git reflog` to get a full list of changes made to our repository:

```git
7102bb4 HEAD@{0}: rebase -i (finish): returning to refs/heads/master
7102bb4 HEAD@{1}: rebase -i (squash): Add contributing, quickstart docs; changelog
867720b HEAD@{2}: rebase -i (squash): # This is a combination of 2 commits.
cdd58ca HEAD@{3}: rebase -i (reword): Add changelog, contributing and quickstart docs
40d4ec1 HEAD@{4}: cherry-pick: fast-forward
dc82960 HEAD@{5}: rebase -i (start): checkout upstream/master
8690cd0 HEAD@{6}: commit: Add changelog
b4514ff HEAD@{7}: commit: Update readme with installation instructions
40d4ec1 HEAD@{8}: commit: Add contributing docs
dc82960 HEAD@{9}: clone: from git@github.com:ndhoule/test-project.git
```

Digging through this list, we can do a little bit of guesswork and figure out that `HEAD@{5}` is where our rebase began, so let's go back to before that by picking the previous commit:

```sh
git reset --hard 'HEAD@{6}' # You can also use the commit SHA, 8690cd0
```

> Note: I always put single quotes around references like `HEAD@{2}` so the shell doesn't [interpret the braces][shell expansion]  in an unintended way.

Now if we run `git reflog` again, we can see that Git moved our repository back to the state it was in before we began our rebase:

```git
8690cd0 HEAD@{0}: reset: moving to HEAD@{6}
7102bb4 HEAD@{1}: rebase -i (finish): returning to refs/heads/master
7102bb4 HEAD@{2}: rebase -i (squash): Add contributing, quickstart docs; changelog
867720b HEAD@{3}: rebase -i (squash): # This is a combination of 2 commits.
cdd58ca HEAD@{4}: rebase -i (reword): Add changelog, contributing and quickstart docs
40d4ec1 HEAD@{5}: cherry-pick: fast-forward
dc82960 HEAD@{6}: rebase -i (start): checkout upstream/master
8690cd0 HEAD@{7}: commit: Add changelog
b4514ff HEAD@{8}: commit: Update readme with installation instructions
40d4ec1 HEAD@{9}: commit: Add contributing docs
dc82960 HEAD@{10}: clone: from git@github.com:ndhoule/test-project.git
```

That's all there is to it!

#### Summary<a id="revert-rebase-tldr"></a>

```sh
git reflog
git reset --hard 'sha_or_HEAD@{number}'
```


-----

<sub><sup><a id="1">1</a></sup>: For a great comparison of merge vs. rebase workflows, including the pros and cons of each, check out [this blog post from Atlassian][Atlassian - merge vs. rebase].</sub>


<!-- Links -->
[Atlassian - merge vs. rebase]: https://blogs.atlassian.com/2013/10/git-team-workflows-merge-or-rebase/
[shell expansion]: http://tldp.org/LDP/Bash-Beginners-Guide/html/sect_03_04.html
[reflog]: http://gitready.com/intermediate/2009/02/09/reflog-your-safety-net.html

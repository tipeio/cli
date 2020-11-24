# Tipe cli
Tipe CLI to manage projects and get started.

## Documentation

For documentation on getting started please visit [documentaion](https://tipe.io/docs/getting-started/cli)


## Instalation

### Yarn 
`yarn i @tipe/cli`

### NPM 
`npm i @tipe/cli -g`


## Commands

### Init
`tipe init` will get you started. after the init command has finished, you will have the following:

* A account on Tipe
* A Tipe project
* An environment for your project
* Some seeded content in your environment
* A seeded schema in your app directory that matches the seeeded content in tipe.
* The Tipe editor installed into your app and ready to be used.

### Auth
`tipe auth` will check to see if youre signed in. If not you'll be prompted to either sign in or sign up.

### Signout
`tipe signout` will sign you out of tipe.

### Keys
`tipe keys :name-of-your-key` will take your through the proccess of creating an API key.

`tipe keys --list` will list all of your avaliable APi keys.



## Contribution 

If you have found a bug or if you would like to add a feature, please create an issue where we can collaborate and come up with a plan on fixing a bug or adding a feature.

Checklist:

* Open an issue if you have found a bug, that has not already been submitted.
* Open an issue if you would like to add a feature
* Open a pull request to fix a bug or add a feature.
* Open a pull request to fix documentation about a command.


## Building the project

Prerequisites:
yarn version 1.22.10

Build Command: `yarn build`

## Submitting a pull request

1. Create a new branch: `git checkout -b your-branch` ensure your branch name reflects your change.
2. Make your change
3. Submit a pull request

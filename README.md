<a name="readme-top"></a>

<br />
<div align="center">
  <h3 align="center">Charter Code Challenge</h3>

  <p align="center">
    A REST API for network shows and packages
    <br />
    <a href="https://github.com/joshua-richardson-88/charter_code_challenge/README.md"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/joshua-richardson-88/charter_code_challenge/issues">Report Bug</a>
    ·
    <a href="https://github.com/joshua-richardson-88/charter_code_challenge/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#database-diagram">Database Diagram</a></li>
        <li><a href="#api">API</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#environments">Environment</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This project is designed to be a REST API to perform CRUD operations on television shows and the purchaseable packages that include them.

### Database Diagram

![Database Diagram](./images/database.png)

### API

| Route         | Method | URL Parameter/JSON body | Inputs                                                                                              | Return                                                                                                                                                                                           |
| ------------- | ------ | ----------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| /shows/?      | GET    | URL Query               | network_id?: string<br> package_id?: string                                                         | Show Array: <br>{ <br>&emsp;id: string, <br>&emsp;title: string, <br>&emsp;imdbRating: number, <br>&emsp;network: { <br>&emsp;&emsp;id: string, <br>&emsp;&emsp;title: string <br>&emsp;}<br>}[] |
| /shows/:id    | GET    | URL Parameter           | id: string                                                                                          | Show Array: <br>{ <br>&emsp;id: string, <br>&emsp;title: string, <br>&emsp;imdbRating: number, <br>&emsp;network: { <br>&emsp;&emsp;id: string, <br>&emsp;&emsp;title: string <br>&emsp;}<br>}[] |
| /shows        | POST   | JSON body               | {<br>&emsp;title: string<br>&emsp;network: string<br>&emsp;imdbRating: number<br>}                  | Show: <br>{ <br>&emsp;id: string, <br>&emsp;title: string, <br>&emsp;imdbRating: number, <br>&emsp;network: { <br>&emsp;&emsp;id: string, <br>&emsp;&emsp;title: string <br>&emsp;}<br>}         |
| /shows        | PUT    | JSON body               | {<br>&emsp;title: string<br>&emsp;network: string<br>&emsp;imdbRating: number<br>}                  | Show: <br>{ <br>&emsp;id: string, <br>&emsp;title: string, <br>&emsp;imdbRating: number, <br>&emsp;network: { <br>&emsp;&emsp;id: string, <br>&emsp;&emsp;title: string <br>&emsp;}<br>}         |
| /shows/:id    | DELETE | URL Parameter           | id: string                                                                                          | N/A                                                                                                                                                                                              |
| /packages     | GET    | N/A                     | N/A                                                                                                 | Package Array:<br>{<br>&emsp;name: string<br>&emsp;price: number<br>&emsp;network: {<br>&emsp;&emsp;id: string<br>&emsp;&emsp;title: string<br>&emsp;}<br>}[ ]                                   |
| /packages/:id | GET    | URL Paramter            | id: string                                                                                          | Package:<br>{<br>&emsp;name: string<br>&emsp;price: number<br>&emsp;network: {<br>&emsp;&emsp;id: string<br>&emsp;&emsp;title: string<br>&emsp;}<br>}                                            |
| /packages     | POST   | JSON body               | {<br>&emsp;name: string<br>&emsp;network: string<br>&emsp;price: number<br>}                        | Package:<br>{<br>&emsp;name: string<br>&emsp;price: number<br>&emsp;network: {<br>&emsp;&emsp;id: string<br>&emsp;&emsp;title: string<br>&emsp;}<br>}                                            |
| /packages     | PUT    | JSON body               | {<br>&emsp;id: string<br>&emsp;name?: string<br>&emsp;network?: string<br>&emsp;price?: number<br>} | Package:<br>{<br>&emsp;name: string<br>&emsp;price: number<br>&emsp;network: {<br>&emsp;&emsp;id: string<br>&emsp;&emsp;title: string<br>&emsp;}<br>}                                            |
| /packages/:id | DELETE | URL Parameter           | id: string                                                                                          | N/A                                                                                                                                                                                              |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

This project is built with express in typescript. All routes are handled functionally with fp-ts

- [typescript](https://www.typescriptlang.org/)
- [express.js](https://expressjs.com/)
- [fp-ts](https://github.com/gcanti/fp-ts)
- [prisma](https://www.prisma.io/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

There are several ways to get started, outlined below.

### Environment

Create a .env file in the server directory and assign the following properties:

- DATABASE_URL
  - The database url to point the server towards
- PORT
  - The desired port to run the server on

If you don't have a postgres database prepared, and you have docker available -
you can create another .env file in the postgres directory with the following properties:

- POSTGRES_USER
  - The user to attach to the database
- POSTGRES_PASSWORD
  - The password for the user

These can then be used to set up the DATABASE_URL above: `postgres://POSTGRES_USER:POSTGRES_PASSWORD@localhost:5432`

### Installation

1. Set up a postgres database (docker or otherwise)
2. Clone the repo
   ```sh
   git clone https://github.com/joshua-richardson-88/charter_code_challenge.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
   ```sh
   yarn
   ```
4. Generate prisma client
   ```sh
   yarn generate
   ```
5. Seed the database
   ```sh
   yarn seed
   ```
6. Start the server
   ```sh
   yarn start
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Joshua Richardson - josh@cursedtale.com

Project Link: [https://github.com/joshua-richardson-88/charter_code_challenge](https://github.com/joshua-richardson-88/charter_code_challenge)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

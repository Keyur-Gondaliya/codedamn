# Codedamn Lite

Codedamn Lite is a powerful development environment that allows users to select their preferred environment and run code securely within docker containers on cloud.

# High Level Architecture

[![IMAGE ALT TEXT HERE](<https://github.com/Vzila/Images/blob/main/Untitled%20design(1).png?raw=true>)](https://youtu.be/ZWVq66HgEQQ)

## Container Creation Steps (Deep Dive)

    Click Create* : Assigning Default boilerplate files.
    Request Container* : Get available port and create container.
    Get dedicated container* : user request for file to server, server fetch it from s3 and send one copy to user and one to update docker container.
    Connect Container* : Connect container terminal to browser.
    Editor setup* : Config Monaco Editor.
    Finalize Playground* : Re-validation and Browser view(If Exists).

# Project Setup

## Requirements

Before you proceed with setting up Turbo Code Sandbox, ensure you have the following dependencies installed:

    Node.js (>=22.x)
    Docker

## Docker

After Installing Pull Below Docker images to your system.

    $ docker pull keyurgondaliya403/react-codedamn
    $ docker pull keyurgondaliya403/node-codedamn
    $ docker pull keyurgondaliya403/python-codedamn

Now Run below commands sufficient permissions to access Docker.

    $ sudo usermod -aG docker $USER
    $ newgrp docker

## Getting Started

### 1. Clone the Repository

    git clone https://github.com/Keyur-Gondaliya/codedamn-lite.git

### 2. Install Dependencies

    $ cd codedamn-lite/server
    $ npm install

    $ cd codedamn-lite/client
    $ npm install

### 3. Environment Configuration

Create a .env file in the apps/server and apps/client directory based on the provided .env.example file. Update the environment variables as per your configuration.

### 4. Run

Go to the root and run

    $ npm run dev

### 5. Ruuning Urls

    Frontend : http://localhost:3000/
    Backend : http://localhost:3001/

# Contributing

We welcome contributions to Codedamn-lite! Feel free to submit bug reports, feature requests, or pull requests through GitHub.

# License

This project is licensed under the MIT License.

#### **_ Feel free to customize the README further based on your project's specific details and requirements. Let me know if you need any further assistance! _**

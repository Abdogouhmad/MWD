# Merriam-Webster Dictionary Data Cleaner

## Overview

This project is a REST API built with Deno 2.0 that aims to clean the dataset of the Merriam-Webster dictionary.
The API extracts relevant definitions and pronunciations for given words, providing a standardized format for easy consumption by applications.

## Features

- Fetch definitions and pronunciations for words using the Merriam-Webster API.
- Clean and structure the data into fast definitions and APA pronunciations.
- Easy integration with various applications via a RESTful interface.

## Getting Started

### Prerequisites

- Deno 2.0 or higher installed on your machine.
- A valid API key for the Merriam-Webster dictionary.

### Environment Variables

Before running the project, ensure you set the following environment variables:

- `MW_L_URL`: The URL for the Merriam-Webster API.
- `MW_L_KEY`: Your API key for accessing the Merriam-Webster API.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Abdogouhmad/MWD
cd mwd
```

2. Install dependencies (if applicable):

```bash
deno run --allow-net --allow-env your_script.ts
```

### Running the API

```bash
deno run --allow-net --allow-env server.ts
```

## API Endpoints

### GET /define/:word

- Fetch definitions and pronunciations for a specified word.
  - Parameters
    - word: The word to be searched for in the Merriam-Webster dictionary.
  - Responses
    - 200 OK: Returns a JSON object containing definitions and pronunciations.
      - 500 Internal Server Error: If the API fails to fetch data.


# Alerting System for Monitoring Failed POST Requests

This project is an alerting system designed to monitor and handle failed POST requests using Node.js, Express, MongoDB, Mongoose, Redis, and TypeScript. The system provides metrics on failed requests and sends alerts via email when certain thresholds are exceeded.

## Optimization with Redis

To enhance performance and optimize resource usage, the system utilizes Redis as an in-memory data store. The following optimizations are implemented:

1. **Temporary Storage**: Failed requests are temporarily stored in Redis, allowing for quick access and reducing the load on the MongoDB database during high traffic periods.

2. **Threshold Management**: When the count of failed requests from a specific IP exceeds a defined threshold (set to 100), the details are bulk inserted into MongoDB using the `multi` command. This bulk operation significantly increases the server speed by minimizing the number of database writes.

3. **Data Aggregation**: Before transferring data from Redis to MongoDB for permanent storage, an aggregation pipeline is utilized to summarize and efficiently organize the data, reducing redundancy and improving query performance.

4. **Rate-Limit**:Rate Limit is added on both mongodb and express(if using one ip to send request not use mongodbrate limit)
## Technologies Used

- **Node.js**: JavaScript runtime for building scalable server-side applications.
- **Express**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing request data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **Redis**: In-memory data structure store, used for caching and quick access to data.
- **TypeScript**: A superset of JavaScript that adds static types.
- **Nodemailer**: Library for sending emails from Node.js applications.
- **Docker**: Tool for containerizing applications.

## Environment Variables

To run the project, you need to set the following environment variables:

```plaintext
PORT=3000
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.dn7k1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
ACCESS_TOKEN="your_access_token"
SMTP_USER="your_smtp_email@gmail.com"
SMTP_PASS="your_smtp_password"
ALERT_EMAIL="alert_email@gmail.com"
REDIS_URL="redis://127.0.0.1:6379"
```

- `PORT`: The port on which the server will run.
- `MONGO_URL`: Connection string for MongoDB.
- `ACCESS_TOKEN`: The access token for request validation.
- `SMTP_USER`: The email address used to send alerts.
- `SMTP_PASS`: The password for the SMTP user.
- `ALERT_EMAIL`: The email address to which alerts will be sent.
- `REDIS_URL`: The URL for connecting to the Redis server.

## Features

- **API Endpoints**:
  - `GET /api/metrics`: Retrieve metrics on failed POST requests.
  - `POST /api/submit`: Submit data and monitor for failures.

- **Models**:
  - **Failed Requests**: Schema to store failed request details.
    - **IP**: The IP address of the client.
    - **Count**: Number of failed requests from the same IP.
    - **Reason**: Reason for the failure.

## Workflow

1. **Submit Handler (`submit.ts`)**:
   - When a request is made to `/api/submit`, the handler checks the request token and headers.
   - If the request is invalid (e.g., invalid token or headers), the details are passed to Redis for temporary storage.
   - If the count of failed requests from an IP exceeds a defined threshold (set to 100), the system stores this data in MongoDB using a bulk insert for improved server performance.
   - Additionally, an email alert is sent via Nodemailer for each failed request. Be cautious as email sending may be blocked after reaching a limit.

2. **Metrics Retrieval**:
   - When a request is made to `/api/metrics`, the system transfers all relevant data from Redis to MongoDB (using the same bulk insert function) and then retrieves the metrics.
   - Aggregation pipelines are used to summarize the data.

3. **Rate Limiting**:
   - The system uses `express-rate-limit` to control the rate of incoming requests.
   - MongoDB rate limits are also implemented, which should be used only if you are certain that multiple failed requests are from different IPs.

## Docker Setup

A Dockerfile is provided to run the application in a containerized environment with Apache HTTP server.

### Docker Run Command

To run the application, use the following command:

```bash
ab -n 521 -c 8 -p /usr/src/app/data.json -T application/json http://host.docker.internal:3000/api/submit
```

Make sure to create a `data.json` file containing the JSON data you wish to submit.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables and database connections (MongoDB and Redis).

4. Run the application:
   ```bash
   npm start
   ```

## Contributing

By Sagar Kapoor

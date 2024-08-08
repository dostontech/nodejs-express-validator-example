const express = require("express")
const {
  param,
  query,
  body,
  matchedData,
  validationResult,
} = require("express-validator")

// initialize an Express server
const app = express()
app.use(express.json())

// an array to use an in-memory database
const users = [
    { id: 1, email: "john.doe@example.com", fullName: "John Doe", age: 30 },
    { id: 2, email: "jane.smith@example.com", fullName: "Jane Smith", age: 25 },
    { id: 3, email: "bob.johnson@example.com", fullName: "Bob Johnson", age: 40 },
    { id: 4, email: "alice.williams@example.com", fullName: "Alice Williams", age: 35 },
    { id: 5, email: "mike.brown@example.com", fullName: "Mike Brown", age: 28 },
    { id: 6, email: "sara.taylor@example.com", fullName: "Sara Taylor", age: 33 },
    { id: 7, email: "chris.lee@example.com", fullName: "Chris Lee", age: 22 },
    { id: 8, email: "emily.davis@example.com", fullName: "Emily Davis", age: 45 },
    { id: 9, email: "alex.johnson@example.com", fullName: "Alex Johnson", age: 27 },
    { id: 10, email: "lisa.wilson@example.com", fullName: "Lisa Wilson", age: 38 },
]

// define three sample validated endpoints
app.get("/api/v1/users/:userId", param("userId").isInt(), (req, res) => {
  // extract the data validation result
  const result = validationResult(req)
  if (result.isEmpty()) {
    const userId = req.params.userId
    // find a user by id
    const user = users.find((user) => user.id == userId)

    if (!user) {
      res.status(404).send("User not found!")
    } else {
      res.send({
        user: user,
      })
    }
  } else {
    res.status(400).send({ errors: result.array() })
  }
})

app.get(
  "/api/v1/users",
  query("search").optional().trim().notEmpty(),
  (req, res) => {
    // extract the data validation result
    const result = validationResult(req)
    if (result.isEmpty()) {
      // select all users by default
      let filteredUsers = users

      // read the matched query data from "req"
      const data = matchedData(req)
      const search = data.search
      if (search !== undefined) {
        // filter users by fullName with a case-insensitive search
        filteredUsers = users.filter((user) => {
          return user.fullName.toLowerCase().includes(search.toLowerCase())
        })
      }

      res.send({
        users: filteredUsers,
      })
    } else {
      res.status(400).send({ errors: result.array() })
    }
  }
)

app.post(
  "/api/v1/users",
  body("fullName").trim().notEmpty(),
  body("email").isEmail().withMessage("Not a valid e-mail address"),
  body("age").isInt({ min: 18 }),
  (req, res) => {
    // extract the data validation result
    const result = validationResult(req)
    if (result.isEmpty()) {
      // read the matched body data from "req"
      const newUser = matchedData(req)
      const maxId = users.reduce(
        (max, user) => (user.id > max ? user.id : max),
        0
      )

      // add a new user with an auto-incremented id
      users.push({
        id: maxId + 1,
        ...newUser,
      })

      res.status(201).send()
    } else {
      res.status(400).send({ errors: result.array() })
    }
  }
)

// start the server locally on port 3000
const port = 3000
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
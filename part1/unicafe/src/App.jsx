import { useState } from "react"

const StatisticLine = (props) => {
  return(
  <tr>
    <td>{props.text} </td>
    <td>{props.value}</td>
  </tr>
  )
}
const Statistics = ({good, neutral, bad}) => {
  const total = good + neutral + bad
  const average = (good - bad) / total
  const positive = (good / total) * 100

  if (total === 0) {
    return (
      <p>No feedback given</p>
    )
  }
return (
  <table>
    <tbody>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="all" value={total} />
      <StatisticLine text="average" value={average} />
      <StatisticLine text="positive" value={`${positive} %`} />
    </tbody>
  </table>
)
}

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const Stats_header = (props) => {
  return (
    <>
      <h1> {props.headers.stats}</h1>
    </>
  )
}

const Feedback_header = (props) => {
  return (
    <>
      <h1> {props.headers.feedback}</h1>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleBad = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
  }

  const handleNeutral = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
  }

  const handleGood = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
    console.log("good reviews", good)
  }

  const headers = {
    feedback: "give feedback",

    stats: "statistics",
  }


  return (
    <div>
      <Feedback_header headers={headers} />
      <Button onClick={handleGood} text="good" />
      <Button onClick={handleNeutral} text="neutral" />
      <Button onClick={handleBad} text="bad" />
      <Stats_header headers={headers} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App

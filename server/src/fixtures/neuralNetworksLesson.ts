import type { GenerateResponse } from "../../../shared/generateSchema.js";

export const neuralNetworksLesson = {
  explanation: {
    text: "A neural network is a computer system that learns patterns by passing information through connected layers of simple units called neurons. During training, it adjusts connection strengths so its answers become more useful.",
    example:
      "A spam filter can learn from examples of unwanted and ordinary email, then use patterns in new messages to decide which ones are likely spam.",
  },
  conceptMap: {
    nodes: [
      {
        id: "neural-networks",
        label: "Neural Networks",
        explanation:
          "A learning system made of connected layers that transform input into a prediction.",
      },
      {
        id: "neurons",
        label: "Neurons",
        explanation:
          "Small processing units that combine incoming signals and pass a result to the next layer.",
      },
      {
        id: "weights",
        label: "Weights",
        explanation:
          "Numbers that control how strongly one neuron influences another.",
      },
      {
        id: "training",
        label: "Training",
        explanation:
          "The process of adjusting a network using examples so its predictions improve.",
      },
      {
        id: "backpropagation",
        label: "Backpropagation",
        explanation:
          "A method for sending prediction error backward through the network to help update its weights.",
      },
    ],
    edges: [
      { id: "network-neurons", source: "neural-networks", target: "neurons" },
      { id: "neurons-weights", source: "neurons", target: "weights" },
      { id: "weights-training", source: "weights", target: "training" },
      {
        id: "training-backpropagation",
        source: "training",
        target: "backpropagation",
      },
      {
        id: "backpropagation-weights",
        source: "backpropagation",
        target: "weights",
      },
    ],
  },
  quiz: [
    {
      question: "What is a neuron in a neural network?",
      options: [
        "A small unit that processes incoming signals",
        "A stored copy of every training example",
        "A rule that prevents the network from changing",
      ],
      correctAnswerIndex: 0,
      explanation:
        "A neuron combines incoming signals into a result. That result is passed onward through the network so the full system can make a prediction.",
      optionExplanations: [
        "This is correct because a neuron processes incoming signals and passes a result onward.",
        "A network learns from examples, but a neuron is not a stored copy of the dataset.",
        "Neurons help a network process information; they do not stop it from changing during training.",
      ],
      nodeId: "neurons",
    },
    {
      question: "What do weights control?",
      options: [
        "The number of examples in a dataset",
        "How strongly connected neurons influence one another",
        "The order a student answers quiz questions",
      ],
      correctAnswerIndex: 1,
      explanation:
        "Weights set how strongly one neuron affects another. During training, the network adjusts these values to improve its predictions.",
      optionExplanations: [
        "The number of training examples is part of the dataset, not what a connection weight controls.",
        "This is correct because a weight sets the strength of influence between connected neurons.",
        "Quiz order is unrelated to the values a neural network uses to connect its neurons.",
      ],
      nodeId: "weights",
    },
    {
      question: "How does backpropagation help a network learn?",
      options: [
        "It removes all incorrect training examples",
        "It turns the network into a fixed lookup table",
        "It sends prediction error backward to help update weights",
      ],
      correctAnswerIndex: 2,
      explanation:
        "Backpropagation sends information about prediction error backward through the network. That signal helps guide updates to the weights that contributed to the result.",
      optionExplanations: [
        "Backpropagation uses errors to improve learning; it does not delete examples from the dataset.",
        "The method helps update a network, rather than turning it into a fixed lookup table.",
        "This is correct because backpropagation sends prediction error backward to guide weight updates.",
      ],
      nodeId: "backpropagation",
    },
  ],
} satisfies GenerateResponse;

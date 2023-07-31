import "../styles/BFS.css"
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter"
import java from "react-syntax-highlighter/dist/cjs/languages/prism/java"
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism"
import Box, { animatedMove } from "../components/Box"
import { useCallback, useEffect, useState } from "react"

/**
 * This class represents the state of the BFS algorithm and supports the associated animations
 */
export class BFSStateObject {
	constructor(vertices, edges) {
		if (typeof vertices === "undefined" || typeof edges === "undefined") {
			let num = Math.floor(Math.random() * 5 + 5)
			let [V, E] = generateConnectedGraph(num)
			this.vertices = V
			this.edges = E
		} else {
			this.vertices = vertices
			this.edges = edges
		}

		// Populate adjacency lists
		this.adjacencies = generateAdjacencyLists(this.vertices, this.edges)

		this.visited = []
		this.stack = []
		this.finished = false
	}

	/**
	 * This function clones and advances the current state of the BFSStateObject
	 * @returns A clone of the current state, advanced one step if possible
	 */
	step() {
		if (this.finished || this.stack.length === 0) {
			return this
		}

		// Clone this object
		let obj = new BFSStateObject(this.vertices, this.edges)
		obj.visited = this.visited
		obj.stack = this.stack

		// Get the first node in the stack that has not been visited, if one exists
		let node = obj.stack.pop()
		while (node in obj.visited) {
			node = obj.stack.pop()
		}
		if (node === undefined) {
			// No more nodes in the stack, we have traversed the entire tree
			obj.finished = true
			return obj
		}

		// Mark this node as visited
		obj.visited.push(node)

		// Push node's neighbours on to the stack
		let neighbours = obj.adjacencies[node - 1]
		neighbours.forEach(n => {
			obj.stack.push(n)
		})

		return obj
	}
}

/**
 * Generates adjaency lists for the input graph G = (V, E)
 * @param {number[]} V the list of vertices in the graph
 * @param {Object[]} E the list of edges in the graph
 */
export function generateAdjacencyLists(V, E) {
	let adjacencies = []
	for (let i = 1; i <= V.length; i++) {
		let arr = []
		E.forEach(edge => {
			if (edge.to === i) {
				arr.push(edge.from)
			} else if (edge.from === i) {
				arr.push(edge.to)
			}
		})
		adjacencies.push(arr)
	}
	return adjacencies
}

/**
 * This function generates a connected graph with num vertices.
 * Each vertex will be assigned a random degree between 1 and num-1.
 * @param {number} num the number of vertices to create in the graph
 * @returns {*} G represents the created graph, index 0 is the vertices array, index 1 is the edges array.
 * Each vertex is an integer, each edge is a object { from: int, to: int }.
 */
export function generateConnectedGraph(num) {
	let vertices = []
	let edges = []
	for (let i = 0; i < num; i++) {
		let vertex = Math.floor(Math.random() * 12)
		while (vertices.includes(vertex)) {
			vertex = Math.floor(Math.random() * 12)
		}
		vertices.push(vertex)
		let desiredDegree = Math.min(vertices.length - 1, Math.floor(Math.random() * (num - 2) + 1))
		let numEdges = 0
		// Count the number of edges that already go to i
		edges.forEach(edge => {
			if (edge.to === vertex) {
				numEdges++
			}
		})
		// Add edges if current degree < desiredDegree
		while (numEdges < desiredDegree) {
			// Find a different vertex j which doesn't share an edge with i
			let j = Math.floor(Math.random() * vertices.length)
			while (edges.includes({ from: vertex, to: vertices[j] }) || vertices[j] === vertex) {
				j = Math.floor(Math.random() * vertices.length)
			}
			edges.push({ from: vertex, to: vertices[j] })
			numEdges++
		}
	}
	return [vertices, edges]
}

function BFS() {
	SyntaxHighlighter.registerLanguage("java", java)

	const [obj, setObj] = useState(new BFSStateObject())
	const [bfsBoxWidth, setBFSBoxWidth] = useState(0)

	const handleResize = useCallback(() => {
		let boxes = document.getElementById("bfs-boxes")
		if (boxes === null) {
			return
		}
		let newWidth = boxes.clientWidth
		for (let i = 0; i < 12; i++) {
			if (i + 1 in obj.vertices) {
				console.log(i + 1)
			}
		}
	}, [bfsBoxWidth])

	useEffect(() => {
		// for (let i = 0; i < 12; i++) {
		// 	animatedMove("bfs-b" + i, "30px", "30px", "30px", "30px")
		// 	console.log(i)
		// }
	}, [])

	return (
		<div className="page">
			<div id="bfs-box" className="fg-box">
				<p className="title-text">breadth first search</p>
				<p className="title-description">graph traversal algorithm</p>
				<div id="bfs-boxes">
					{(() => {
						let boxes = []
						obj.vertices.forEach(vertex => {
							boxes.push(<Box text={vertex + 1} id={"bfs-b" + vertex} key={"bfs-box" + vertex} />)
						})
						return boxes
					})()}
				</div>
			</div>
			<div className="extra">
				<div className="fg-box">
					<p className="extra-box-text">Steps</p>
					<div className="extra-box-children">
						<ol type="1">
							<li>step one</li>
							<li>step 2</li>
						</ol>
					</div>
				</div>
				<div className="fg-box">
					<p className="extra-box-text">Code</p>
					<div className="extra-box-children">
						<SyntaxHighlighter language="java" style={tomorrow} showLineNumbers>{`// Code goes here!`}</SyntaxHighlighter>
					</div>
				</div>
			</div>
		</div>
	)
}

export default BFS

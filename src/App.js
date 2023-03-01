import React, { Component } from 'react'
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import ParticlesBg from 'particles-bg'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Clarifai from 'clarifai'
import './App.css'

console.log(Clarifai)

const app = new Clarifai.App({
	apiKey: '493314472c594b87b0dcfdf58a42b441',
})

class App extends Component {
	constructor() {
		super()
		this.state = {
			input: '',
			imageUrl: '',
			box: {},
		}
	}

	calculateFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
		const image = document.getElementById('inputimage')
		const width = Number(image.width)
		const height = Number(image.height)
		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - clarifaiFace.right_col * width,
			bottomRow: height - clarifaiFace.bottom_row * height,
		}
	}

	displayFaceBox = (box) => {
		this.setState({ box: box })
	}

	onInputChange = (event) => {
		this.setState({ input: event.target.value })
	}

	onButtonSubmit = () => {
		this.setState({ imageUrl: this.state.input })
		app.models
			.predict(
				{
					id: 'face-detection',
					name: 'face-detection',
					version: '6dc7e46bc9124c5c8824be4822abe105',
					type: 'visual-detector',
				},
				this.state.input
			)
			.then((response) => {
				console.log('hi', response)
				// if (response) {
				// 	fetch('http://localhost:3000/image', {
				// 		method: 'put',
				// 		headers: { 'Content-Type': 'application/json' },
				// 		body: JSON.stringify({
				// 			id: this.state.user.id,
				// 		}),
				// 	})
				// 		.then((response) => response.json())
				// 		.then((count) => {
				// 			this.setState(Object.assign(this.state.user, { entries: count }))
				// 		})
				// }
				this.displayFaceBox(this.calculateFaceLocation(response))
			})
			.catch((err) => console.log(err))
	}

	render() {
		return (
			<div className='App'>
				<ParticlesBg
					className='particles-bg'
					type='cobweb'
					bg={true}
				/>
				<Navigation />
				<Logo className='center' />
				<Rank />
				<ImageLinkForm
					onInputChange={this.onInputChange}
					onButtonSubmit={this.onButtonSubmit}
				/>
				<FaceRecognition
					imageUrl={this.state.imageUrl}
					box={this.state.box}
				/>
			</div>
		)
	}
}

export default App

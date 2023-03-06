import React, { Component } from 'react'
import ParticlesBg from 'particles-bg'
import Clarifai from 'clarifai'
import Navigation from './components/Navigation/Navigation'
import SignIn from './components/SignIn/SignIn'
import Register from './components/Register/Register'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import './App.css'

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
			route: 'signIn',
			isSignedIn: false,
			user: {
				id: '',
				name: '',
				email: '',
				entries: 0,
				joined: '',
			},
		}
	}

	loadUser = (data) => {
		console.log('logging', data)
		this.setState({
			user: {
				id: data.id,
				name: data.name,
				email: data.email,
				entries: data.entries,
				joined: data.joined,
			},
		})
	}

	componentDidMount() {
		fetch('http://localhost:3000/')
			.then((response) => response.json())
			.then(console.log)
	}

	calculateFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
		const image = document.getElementById('inputImage')
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

	onPictureSubmit = () => {
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
				if (response) {
					fetch('http://localhost:3000/image', {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							id: this.state.user.id,
						}),
					})
						.then((response) => response.json())
						.then((count) => {
							this.setState(Object.assign(this.state.user, { entries: count }))
						})
				}
				this.displayFaceBox(this.calculateFaceLocation(response))
			})
			.catch((err) => console.log(err))
	}

	onRouteChange = (route) => {
		if (route === 'signOut') {
			this.setState({ isSignedIn: false })
		} else if (route === 'home') {
			this.setState({ isSignedIn: true })
		}
		this.setState({ route: route })
	}

	render() {
		const { isSignedIn, imageUrl, route, box } = this.state
		return (
			<div className='App'>
				<ParticlesBg
					color='#FFFFFF'
					className='particles-bg'
					type='cobweb'
					bg={true}
				/>
				<Navigation
					isSignedIn={isSignedIn}
					onRouteChange={this.onRouteChange}
				/>
				{route === 'home' ? (
					<div>
						<Logo />
						<Rank
							name={this.state.user.name}
							entries={this.state.user.entries}
						/>
						<ImageLinkForm
							onInputChange={this.onInputChange}
							onPictureSubmit={this.onPictureSubmit}
						/>
						<FaceRecognition
							imageUrl={imageUrl}
							box={box}
						/>
					</div>
				) : route === 'signIn' ? (
					<SignIn
						loadUser={this.loadUser}
						onRouteChange={this.onRouteChange}
					/>
				) : (
					<Register
						loadUser={this.loadUser}
						onRouteChange={this.onRouteChange}
					/>
				)}
			</div>
		)
	}
}

export default App

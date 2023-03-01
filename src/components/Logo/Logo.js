import React from 'react'
import Tilt from 'react-parallax-tilt'
import './Logo.css'
import brain from './brain.png'

const Logo = () => {
	return (
		<div className='ma4 mt0'>
			<Tilt className='Tilt br2 shadow-2'>
				<div
					className='Tilt-inner pa3'
					style={{ height: '200px', width: '150px' }}
				>
					<img
						style={{ paddingLeft: '25px', paddingTop: '25px', width: '250px' }}
						src={brain}
						alt='logo'
					/>
				</div>
			</Tilt>
		</div>
	)
}

export default Logo

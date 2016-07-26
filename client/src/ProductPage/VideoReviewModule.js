
import React from 'react';
import Paper from 'material-ui/Paper';

const styles = {
	container: {
		padding: '1rem',
		marginTop: '2rem',
		textAlign: 'center'
	},
	title: {
		width: '100%',
		textAlign: 'left',
	}
}

class VideoReviewModule extends React.Component {
	render() {
		var product = this.props.product;
		if (!product || !product.YoutubeVideo) {
			return '';
		}

		return (
			<Paper zDepth={2} style={styles.container} >
				<h2 style={styles.title} class="module-title">Featured Video Review</h2>
				<iframe width="560" height="315" src={product.YoutubeVideo} 
					frameborder="0" allowFullScreen></iframe>
			</Paper>
		);
	}
}

export default VideoReviewModule;
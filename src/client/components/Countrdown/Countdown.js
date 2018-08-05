import { Component } from 'react';

class Countdown extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            time: null,
            onFinish: null
        }
    }
    
    componentDidMount() {
        
        this.setState({
            time: new Date(this.props.toDate)/1000
        });
    
        this.decr = setInterval(this.update, 1000);
    }
    
    update = () => {
        const newTime = this.state.time - 1; // minus one sec from initial time

        this.setState({
            time: newTime
        });

        if(this.state.time === 0 || !this.state.time){
            clearInterval(this.decr);

            this.setState({
                onFinish: this.props.onFinish
            })
        }
    };
    
    render() {

        const { onFinish } = this.state;

        const formattedDate = new Date(this.props.toDate);
        const today = new Date();
        const msDiff = formattedDate - today;
        const days = parseInt(msDiff / (24 * 3600 * 1000), 10);
        const hours = parseInt(msDiff / (3600 * 1000) - (days * 24), 10);
        const mins = parseInt(msDiff / (60 * 1000) - (days * 24 * 60) - (hours * 60), 10);
        const secs = parseInt(msDiff / (1000) - (mins * 60) - (days * 24 * 60 * 60) - (hours * 60 * 60), 10);

        return !(onFinish) ? `${days} dni ${hours}:${mins}:${secs}` : onFinish;

    }
    
}

export default Countdown;
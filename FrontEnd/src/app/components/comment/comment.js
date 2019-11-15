
import React from 'react';
import config from '../../../config/app-config';


class Comment extends React.Component { 
    constructor(props) {
        super(props);
    }
    render() {
        return ( 
            <div className="t-tweet-container t-comment-container">
                <div>
                    <img class="t-tweet-avatar" style={{width: '50px'}} src={config.base + "public/images/no-dp.png"}/>
                </div>
                <div class="t-tweet-right">
                    <div>
                        <span className="t-primary-bold"> {this.props.data.user} </span>
                        <span className="t-secondary"> @handle </span>
                        <span className="t-secondary" style={{marginLeft: "40px"}}> {this.props.data.timeElapsed}</span>
                    </div>
                    <div>
                        <p>{this.props.data.text}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Comment;
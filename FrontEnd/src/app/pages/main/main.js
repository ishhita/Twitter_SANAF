import React from 'react';
import { connect } from 'react-redux';
import  LeftNav  from '../../components/leftnav/leftnav';
import  TopNav  from '../../components/topnav/topnav';
import { Switch, Route, Redirect } from 'react-router-dom';
import NewsFeed from './../newsfeed/newsfeed';
import TweetView from './../tweet-view/tweet-view';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
      return (
          <div className="t-app-container">
            <LeftNav/>
            <div className="t-main-container">
                <TopNav/>
                <div className="t-main-content">
                    <Switch>
                        {/* ADD ROUTES HERE */}
                        <Route exact path="/ui/" render={() => (
                                <Redirect to="/ui/newsfeed" />        
                        )} /> 
                        <Route path="/ui/newsfeed" component={NewsFeed}/>
                        <Route path="/ui/tweet" component={TweetView}/>
                    </Switch>
                </div>
            </div>
          </div>
      )
    }
}
const mapStateToProps = state => {
    return {
    }
}
const mapDispatchToProps = dispatch => {
    return {
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
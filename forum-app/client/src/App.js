import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import PostDetail from './components/PostDetail';
import CreatePost from './components/CreatePost';
import Header from './components/Header';

function App() {
    return (
        <Router>
            <Header />
            <div className="App">
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/posts/:id" component={PostDetail} />
                    <Route path="/create" component={CreatePost} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
import React, { Component } from 'react';

class Track extends Component {
    render() {
        return (
            <div>{this.props.track}</div>
        );
    }
}

export default class App extends Component {
    render() {
        const song = {
            track: "Hello World!"
        }
        return (
            <section>
                <div class="bgdiv"></div>
                <div class="titlediv">
                    <h1>Cronus</h1>
                    <h4>An IPFS Music Player</h4>
                </div>
                <div class="main">
                    <Track {...song} />
                    <hr />
                    <table>
                        <tr>
                        <td class="button-container">
                            <div id="play" class="round-button">
                                <div id="inner-button" class="round-button-circle"><h1>&gt;</h1></div>
                            </div>
                        </td>
                        <td>
                            <div class="wave-container">
                                <div id="wave"></div>
                            </div>
                        </td>
                        </tr>
                    </table>
                    <hr />
                </div>
            </section>
        );
    }
}

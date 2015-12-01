import React, { Component } from 'react';
import Promise from 'yaku';
const AudioCtx = new (window.AudioContext || window.webkitAudioContext)();

function getAudioWaveFrom(hash) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();

        request.open('GET', `/ipfs/${hash}`, true);
        request.responseType = 'arraybuffer';

        request.onload = () => {
            AudioCtx.decodeAudioData(request.response, resolve, reject);
        }

        request.send()
    });
}


class WaveForm extends Component {
    draw (width, step, height, data, ctx, w, loc, color) {
        for (var i = 0; i < width / w; i++) {
            let min = 1.0;
            let max = -1.0;

            if (i * w >= loc) {
                ctx.fillStyle = color;
            }

            const mins = [], maxs = [];
            for (var j = 0; j < step; j++) {
                const datum = data[(i * step) + j];

                if (datum < min) {
                    min = datum;
                    mins.push(min);
                } else if (datum > max) {
                    max = datum;
                    maxs.push(max);
                }
            }

            min = mins.reduce((a, b) => a + b) / mins.length;
            max = maxs.reduce((a, b) => a + b) / maxs.length;

            const h = (max - min) * height;
            ctx.fillRect(i*w, height - h + 10, w - 1, h);
        }
    }

    componentDidMount () {
        const width = this.props.width;
        const height = this.props.height;
        const progressColor = this.props.progressColor;
        const position = width * this.props.position;
        const barWidth = this.props.barWidth;

        const channelData = this.props.buffer.getChannelData(0);
        const step = Math.ceil(channelData.length / (width));

        const ctx = this.refs.canvas.getContext('2d');

        ctx.fillStyle = this.props.progressColor;
        this.draw(width, step, height, channelData, ctx, barWidth, position, this.props.color);
    }

    render () {
        return (
            <canvas ref="canvas" width={this.props.width} height={this.props.height}></canvas>
        );
    }
}

class Track extends Component {
    render() {
        const waveform = {
            buffer: this.props.buffer,
            width: 900,
            height: 50,
            color: '#ffffff',
            progressColor: '#0b2d38',
            position: .33,
            barWidth: 4
        }
        return (
            <div>
                <div>{this.props.track}</div>
                <div>{this.props.buffer.length > 0 ? <WaveForm {...waveform} /> : null}</div>
            </div>
        );
    }
}

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            track: {
                buffer: null
            }
        };
    }

    componentDidMount () {
        getAudioWaveFrom('QmbQKteuoSZeC7ZbgPh3RaQQF3713Q9cv8z1BhbUtuQQz1').then(buffer => {
            this.setState({
                track: {
                    buffer
                }
            })
        });
    }

    render() {
        const song = {
            track: "Hello World!",
            buffer: this.state.track.buffer || []
        }

        return (
            <section>
                <div className="bgdiv"></div>
                <div className="titlediv">
                    <h1>Cronus</h1>
                    <h4>An IPFS Music Player</h4>
                </div>
                <div className="main">
                    <Track {...song} />
                    <hr />
                    <table>
                        <tbody>
                            <tr>
                            <td className="button-container">
                                <div id="play" className="round-button">
                                    <div id="inner-button" className="round-button-circle"><h1>&gt;</h1></div>
                                </div>
                            </td>
                            <td>
                                <div className="wave-container">
                                    <div id="wave"></div>
                                </div>
                            </td>
                            </tr>
                        </tbody>
                    </table>
                    <hr />
                </div>
            </section>
        );
    }
}

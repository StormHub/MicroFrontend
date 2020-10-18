import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import { getContainerId, mountMicroApp, shell, unmountMicroApp } from "./Shell";
import Container from "@material-ui/core/Container/Container";

interface MicroFrontendProps {
    name: string;
    host: string;
}

interface IState {
    loading: boolean;
}

export class MicroFrontend extends React.Component<MicroFrontendProps, IState> {
    constructor(props: MicroFrontendProps) {
        super(props);
        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        this.fetchMicroApp();
    }

    fetchMicroApp = () => {
        const { name, host } = this.props;
        const document = shell.document;
        const scriptId = `micro-app-${name}`;
        if (document.getElementById(scriptId)) {
            this.renderMicroFrontend();
            return;
        }

        fetch(`${host}/asset-manifest.json`)
            .then(res => res.json())
            .then(manifest => {
                // main style
                const style = document.createElement("link");
                style.id = `micro-app-${name}`;
                style.setAttribute("rel", "stylesheet");
                style.setAttribute("href", `${host}${manifest.files["main.css"]}`);
                document.head.appendChild(style);

                // main bundle
                const script = document.createElement("script");
                script.id = scriptId;
                script.crossOrigin = "";
                script.src = `${host}${manifest.files["main.js"]}`;
                script.onload = this.renderMicroFrontend;
                script.onerror = this.onCompleted;
                document.head.appendChild(script);
            })
            .catch(this.onCompleted);
    };

    onCompleted = () => {
        this.setState({
            loading: false
        });
    };

    renderMicroFrontend = () => {
        this.onCompleted();

        const { name, host } = this.props;
        mountMicroApp(name, host);
    };

    componentWillUnmount() {
        const { name } = this.props;
        unmountMicroApp(name);
    }

    render() {
        const { name } = this.props;
        const containerId = getContainerId(name);
        return (
            <main id={containerId}>
                {this.renderContent()}
            </main>
        );
    }

    renderContent() {
        const { loading } = this.state;
        if (loading) {
            return (
                <Container>
                    <CircularProgress />
                </Container>
            );
        }

        const { name } = this.props;
        const microApp = (shell.window as any)[`${name}MicroApp`];
        if (!microApp) {
            return (
                <Paper elevation={0}>
                    <Typography variant="h4" color="primary" align="center">
                        Something went wrong!
                    </Typography>
                </Paper>
            );
        }

        return null;
    }
}

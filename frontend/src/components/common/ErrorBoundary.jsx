import { Component } from "react";

import ServerError from "../../pages/ServerError";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("🚨 SignVerse ErrorBoundary caught an unhandled render error:", error);
    if (info?.componentStack) {
      console.error("Component stack trace:", info.componentStack);
    }
    this.setState({ error, errorInfo: info });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ServerError
          error={this.state.error}
          onReload={this.handleReload}
          onRetry={this.handleRetry}
        />
      );
    }
    return this.props.children;
  }
}


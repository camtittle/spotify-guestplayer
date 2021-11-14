import { Component } from 'react';

export enum AdType {
  Vertical,
  Horizontal
};

interface GoogleAdProps {
  type: AdType
}

class GoogleAd extends Component<GoogleAdProps> {

  componentDidMount() {
    let _window = window as any;
    (_window.adsbygoogle = _window.adsbygoogle || []).push({});
  }

  render() {

    let slot: string | undefined;
    switch (this.props.type) {
      case AdType.Horizontal:
        slot = process.env.REACT_APP_GOOGLE_AD_HORIZONTAL_SLOT;
        break;
      case AdType.Vertical:
        slot = process.env.REACT_APP_GOOGLE_AD_VERTICAL_SLOT;
        break;
      default:
        console.log(`Unrecognised ad type ${this.props.type}`);
    }

    if (slot == null) {
      console.log(`Cannot render ad - slot not found in environment config. Ad type: ${this.props.type}`);
      return null;
    }

    return (
      <ins className='adsbygoogle'
        style={{ display: 'block' }}
        data-ad-client={process.env.REACT_APP_GOOGLE_ADS_CLIENT}
        data-ad-slot={slot}
        data-ad-format='auto'
        data-full-width-responsive="true">
      </ins>
    );
  }
}

export default GoogleAd;
import MaskedView from '@react-native-masked-view/masked-view';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

<MaskedView
  style={{ width: 200, height: 200 }}
  maskElement={
    <Svg width="200" height="200" viewBox="0 0 200 200">
      <Path
        d="M0,0 H200 V200 Q100,150 0,200 Z" // example inward curve
        fill="black"
      />
    </Svg>
  }
>
  <View style={{ flex: 1, backgroundColor: 'orange' }} />
</MaskedView>

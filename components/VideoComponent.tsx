import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { TouchableOpacity, Image, Text } from 'react-native';

interface VideoComponentProps {
  muted: boolean;
  // videoRef: React.RefObject<any>;
  src: string;
  onClick?: () => void;
  style?: object;
}

const VideoComponent: React.FC<VideoComponentProps> = ({ muted, /*videoRef,*/ src, onClick, style }) => {
  return (
    <>
      {/* <Video
        ref={videoRef}
        source={{ uri: src }}
        paused={false}
        muted={muted}
        repeat
        resizeMode="cover"
        style={style}
      /> */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 3,
          right: 3,
        }}
        onPress={onClick}
      >
        {muted ? (
            <FontAwesomeIcon icon={'volume-mute'} size={24} color="white" />
        ) : (
            <FontAwesomeIcon icon={'volume-up'} size={24} color="#FFFFFFB2" />
        )}
      </TouchableOpacity>
    </>
  );
};

export default VideoComponent;

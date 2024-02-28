import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Text, View } from 'react-native';

interface PointPlusItemProps {
  icon?: boolean;
  point: string;
}

const PointPlusItem: React.FC<PointPlusItemProps> = ({ point, icon = false }) => {
  return (
    <View
      style={{
        backgroundColor: '#99FF4833',
        borderRadius: 999,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 8,
        alignSelf: 'flex-start'
      }}
    >
      {icon && (
        <FontAwesomeIcon
          icon={faCheckCircle}
          size={32}
          color='#66C61B'
          style={{ marginRight: 6 }}
        />
      )}
      <Text
        style={{
          color: '#99FF48',
          fontSize: 13,
          fontWeight: '500',
        }}
      >
        +{point} points
      </Text>
    </View>
  );
};

export default PointPlusItem;

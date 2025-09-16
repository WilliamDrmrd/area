import React from 'react';
import { Snackbar } from 'react-native-paper';
import { useTheme } from '@contexts/ThemeContext';

const SnackBar = ({ snackbarInfos, setSnackbarInfos } : any) => {

  const theme = useTheme();

  return (
    <Snackbar
      visible={snackbarInfos.visible}
      onDismiss={() => {
        setSnackbarInfos((prev : any) => ({ ...prev, visible: false }));
      }}
      action={{
        label: 'Fermer',
        labelStyle: { color: theme.primary },
        onPress: () => {
          setSnackbarInfos((prev : any) => ({ ...prev, visible: false }));
        },
      }}>
      {snackbarInfos.message}
    </Snackbar>
  );
};

export default SnackBar;

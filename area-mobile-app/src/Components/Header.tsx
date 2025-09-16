import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@contexts/ThemeContext';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Utiliser FontAwesome5 pour des icônes plus modernes
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@contexts/AuthContext';

export default function Header(props: any) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { logout } = useAuth(); // Ajoutez ceci pour avoir accès à la fonction de déconnexion

  return (
    <Animated.View style={[styles.container, { paddingTop: insets.top + 10, backgroundColor: theme.primary }]}>
      <View style={styles.headerContent}>
        {props.showBackArrow && Platform.OS !== "ios" ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
            <Icon name="arrow-left" size={28} color={theme.onPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconContainer}></View>  // Conteneur vide
        )}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.onPrimary, textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10 }]}>{props.title}</Text>
          <Text style={[styles.subtitle, { color: theme.onPrimary }]}>{props.subtitle}</Text>
        </View>
        <TouchableOpacity style={styles.iconContainer} onPress={logout}>
          <Icon name="sign-out-alt" size={20} color={theme.onPrimary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    height: 60,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    bottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: 'center',
  },
});
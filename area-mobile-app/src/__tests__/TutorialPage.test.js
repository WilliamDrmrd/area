// TutorialPage.test.js

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TutorialPage from '../Pages/TutorialPage';

describe('<TutorialPage />', () => {
  it('renders correctly', () => {
    const { getByText } = render(<TutorialPage />);

    // Vérifie que le texte "Optimisez votre temps au maximum avec AREA" est bien présent
    expect(getByText("Optimisez votre temps au maximum avec AREA")).toBeTruthy();

    // Vous pouvez ajouter d'autres vérifications si nécessaire, par exemple pour les boutons ou d'autres éléments du composant.
  });

  it('Skip button is clickable', () => {
    const { getByText } = render(<TutorialPage />);
    const skipButton = getByText('Skip');

    fireEvent.press(skipButton);
    // Vérifiez les éventuels effets du clic sur le bouton "Skip" ici (si une fonction était appelée, si l'état changeait, etc.)
    // Dans le cas actuel, rien ne se produit, donc ce test confirmera simplement que le bouton est cliquable.
  });

  it('Skip button is clickable', () => {
    const { getByText } = render(<TutorialPage />);
    const skipButton = getByText('Continuer');

    fireEvent.press(skipButton);
    // Vérifiez les éventuels effets du clic sur le bouton "Continuer" ici (si une fonction était appelée, si l'état changeait, etc.)
    // Dans le cas actuel, rien ne se produit, donc ce test confirmera simplement que le bouton est cliquable.
  });

  it('renders the Lottie animation', () => {
    const { getByTestId } = render(<TutorialPage />);
    const lottieView = getByTestId('lottie-animation');

    expect(lottieView).toBeTruthy();
  });

});

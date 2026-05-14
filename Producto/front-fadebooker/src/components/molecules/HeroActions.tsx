import React from 'react';
import { ButtonLink } from '../atoms/ButtonLink';

const HeroActions: React.FC = () => (
  <div className="hero-actions">
    <ButtonLink to="/register" variant="primary">Crear cuenta</ButtonLink>
    <ButtonLink to="/barberias" variant="blue">Ver barberías</ButtonLink>
  </div>
);

export default HeroActions;

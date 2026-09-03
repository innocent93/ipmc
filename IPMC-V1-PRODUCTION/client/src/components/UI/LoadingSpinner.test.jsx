import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import LoadingSpinner from '../components/UI/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders without crashing at each size', () => {
    for (const size of ['sm', 'md', 'lg', 'xl']) {
      const { container } = render(<LoadingSpinner size={size} />);
      expect(container.querySelector('.animate-spin')).not.toBeNull();
    }
  });
});

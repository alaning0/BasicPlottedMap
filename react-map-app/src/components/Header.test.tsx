import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';

describe('Header Component', () => {
  const defaultProps = {
    onFindNearbyPoints: jest.fn(),
    status: 'Ready',
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders header with title', () => {
    render(<Header {...defaultProps} />);
    
    expect(screen.getByRole('heading', { name: 'Basic Plotted Map' })).toBeInTheDocument();
  });

  test('renders Find Nearby Points button', () => {
    render(<Header {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: 'Find Nearby Points' });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  test('displays status text', () => {
    const status = 'Loading points...';
    render(<Header {...defaultProps} status={status} />);
    
    expect(screen.getByText(status)).toBeInTheDocument();
  });

  test('calls onFindNearbyPoints when button is clicked', () => {
    const mockOnFindNearbyPoints = jest.fn();
    render(<Header {...defaultProps} onFindNearbyPoints={mockOnFindNearbyPoints} />);
    
    const button = screen.getByRole('button', { name: 'Find Nearby Points' });
    fireEvent.click(button);
    
    expect(mockOnFindNearbyPoints).toHaveBeenCalledTimes(1);
  });

  test('disables button when loading is true', () => {
    render(<Header {...defaultProps} loading={true} />);
    
    const button = screen.getByRole('button', { name: 'Find Nearby Points' });
    expect(button).toBeDisabled();
  });

  test('enables button when loading is false', () => {
    render(<Header {...defaultProps} loading={false} />);
    
    const button = screen.getByRole('button', { name: 'Find Nearby Points' });
    expect(button).not.toBeDisabled();
  });

  test('updates status dynamically', () => {
    const { rerender } = render(<Header {...defaultProps} status="Ready" />);
    expect(screen.getByText('Ready')).toBeInTheDocument();
    
    rerender(<Header {...defaultProps} status="Loading..." />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Ready')).not.toBeInTheDocument();
  });
});
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from './Sidebar';
import { PointDetails } from '../types';

describe('Sidebar Component', () => {
  const mockPointDetails: PointDetails = {
    title: 'New York City Details',
    description: 'The most populous city in the United States.',
    image: 'data:image/svg+xml,%3Csvg%3E%3Ctext%3ENew York%3C/text%3E%3C/svg%3E',
    data: [
      { property: 'Population', value: '8.3 million' },
      { property: 'Area', value: '778.2 km²' },
      { property: 'Founded', value: '1624' },
    ],
  };

  test('renders sidebar with title', () => {
    render(<Sidebar pointDetails={null} loading={false} />);
    
    expect(screen.getByRole('heading', { name: 'Point Details' })).toBeInTheDocument();
  });

  test('shows loading state', () => {
    render(<Sidebar pointDetails={null} loading={true} />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('shows default message when no point is selected', () => {
    render(<Sidebar pointDetails={null} loading={false} />);
    
    expect(screen.getByText('Click on a point to view details')).toBeInTheDocument();
  });

  test('displays point details when provided', () => {
    render(<Sidebar pointDetails={mockPointDetails} loading={false} />);
    
    expect(screen.getByRole('heading', { name: 'New York City Details' })).toBeInTheDocument();
    expect(screen.getByText('The most populous city in the United States.')).toBeInTheDocument();
  });

  test('displays point details image when provided', () => {
    render(<Sidebar pointDetails={mockPointDetails} loading={false} />);
    
    const image = screen.getByRole('img', { name: 'New York City Details' });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockPointDetails.image);
    expect(image).toHaveClass('detail-image');
  });

  test('displays data table when point has data', () => {
    render(<Sidebar pointDetails={mockPointDetails} loading={false} />);
    
    // Check table headers
    expect(screen.getByRole('columnheader', { name: 'Property' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Value' })).toBeInTheDocument();
    
    // Check table data
    expect(screen.getByRole('cell', { name: 'Population' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '8.3 million' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Area' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '778.2 km²' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Founded' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '1624' })).toBeInTheDocument();
  });

  test('does not display image when not provided', () => {
    const pointDetailsWithoutImage: PointDetails = {
      ...mockPointDetails,
      image: undefined,
    };
    
    render(<Sidebar pointDetails={pointDetailsWithoutImage} loading={false} />);
    
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  test('does not display table when no data provided', () => {
    const pointDetailsWithoutData: PointDetails = {
      title: 'Test City',
      description: 'A test city',
      data: [],
    };
    
    render(<Sidebar pointDetails={pointDetailsWithoutData} loading={false} />);
    
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  test('renders correct number of table rows', () => {
    render(<Sidebar pointDetails={mockPointDetails} loading={false} />);
    
    // Should have header row + 3 data rows
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(4); // 1 header + 3 data rows
  });

  test('has correct CSS classes and IDs', () => {
    render(<Sidebar pointDetails={mockPointDetails} loading={false} />);
    
    // Check for the sidebar content instead of direct DOM access
    expect(screen.getByText('Point Details')).toBeInTheDocument();
    expect(screen.getByText('New York City Details')).toBeInTheDocument();
    
    const table = screen.getByRole('table');
    expect(table).toHaveClass('detail-table');
  });
});
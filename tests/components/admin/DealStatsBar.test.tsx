import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DealStatsBar } from '@everyone-web/components/admin/DealStatsBar';

describe('DealStatsBar', () => {
  it('(a) renders three numeric counts from props', () => {
    render(<DealStatsBar counts={{ pending: 3, published: 7, rejected: 2 }} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('(b) published count element has class glow-primary', () => {
    render(<DealStatsBar counts={{ pending: 3, published: 7, rejected: 2 }} />);
    // The published number element should have glow-primary class
    const publishedNumber = screen.getByTestId('published-count');
    expect(publishedNumber).toHaveClass('glow-primary');
  });

  it('(c) renders zeros correctly when all counts are 0', () => {
    render(<DealStatsBar counts={{ pending: 0, published: 0, rejected: 0 }} />);
    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(3);
  });

  it('renders labels for each stat', () => {
    render(<DealStatsBar counts={{ pending: 1, published: 2, rejected: 3 }} />);
    expect(screen.getByText(/pendientes/i)).toBeInTheDocument();
    expect(screen.getByText(/publicadas/i)).toBeInTheDocument();
    expect(screen.getByText(/rechazadas/i)).toBeInTheDocument();
  });
});

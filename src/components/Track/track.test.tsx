import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { data } from '@/data';
import { TrackType } from '@/sharedTypes/sharedTypes';
import ReduxProvider from '@/store/ReduxProvider';
import Track from './Track';
import { formatTime } from '@/utils/helper';

const mockTracks: TrackType[] = data;
const mockTrack: TrackType = data[0];

describe('Track component', () => {
  test('Отрисовка данных трека', () => {
    render(
      <ReduxProvider>
        <Track track={mockTrack} playlist={mockTracks} />
      </ReduxProvider>
    );

    expect(screen.getByText(mockTrack.author)).toBeInTheDocument();
    expect(screen.getByText(mockTrack.name)).toBeInTheDocument();
    expect(screen.getByText(formatTime(mockTrack.duration_in_seconds))).toBeInTheDocument();
  });
});
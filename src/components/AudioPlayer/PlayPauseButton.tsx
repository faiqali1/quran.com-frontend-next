import { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import useChaptersIdsByUrlPath from 'src/hooks/useChapterId';
import {
  AudioFileStatus,
  loadAndPlayAudioFile,
  selectAudioFile,
  selectAudioFileStatus,
  selectAudioPlayerState,
} from 'src/redux/slices/AudioPlayer/state';
import { getChapterData } from 'src/utils/chapter';
import { withStopPropagation } from 'src/utils/event';

import PauseIcon from '../../../public/icons/pause.svg';
import PlayIcon from '../../../public/icons/play-arrow.svg';
import Button, { ButtonShape, ButtonSize, ButtonVariant } from '../dls/Button/Button';
import Spinner, { SpinnerSize } from '../dls/Spinner/Spinner';
import { triggerPauseAudio, triggerPlayAudio } from './EventTriggers';
import SurahAudioMismatchModal from './SurahAudioMismatchModal';

const PlayPauseButton = () => {
  const { isPlaying } = useSelector(selectAudioPlayerState, shallowEqual);
  const audioFileStatus = useSelector(selectAudioFileStatus);
  const audioFile = useSelector(selectAudioFile);
  const isLoading = audioFileStatus === AudioFileStatus.Loading;
  const currentReadingChaptersId = useChaptersIdsByUrlPath();
  const currentAudioChapterId = audioFile?.chapterId?.toString();

  const [isMismatchModalVisible, setIsMismatchModalVisible] = useState(false);

  const onClickPlay = () => {
    if (currentReadingChaptersId.includes(currentAudioChapterId)) {
      triggerPlayAudio();
    } else {
      setIsMismatchModalVisible(true);
    }
  };

  let button;

  if (isLoading)
    button = (
      <Button
        tooltip="Loading ..."
        size={ButtonSize.Large}
        shape={ButtonShape.Circle}
        variant={ButtonVariant.Ghost}
        onClick={withStopPropagation(triggerPauseAudio)}
      >
        <Spinner size={SpinnerSize.Large} />
      </Button>
    );

  if (isPlaying) {
    button = (
      <Button
        tooltip="Pause"
        size={ButtonSize.Large}
        shape={ButtonShape.Circle}
        variant={ButtonVariant.Ghost}
        onClick={withStopPropagation(triggerPauseAudio)}
      >
        <PauseIcon />
      </Button>
    );
  }
  if (!isPlaying)
    button = (
      <Button
        tooltip="Play"
        shape={ButtonShape.Circle}
        size={ButtonSize.Large}
        variant={ButtonVariant.Ghost}
        onClick={withStopPropagation(onClickPlay)}
      >
        <PlayIcon />
      </Button>
    );

  return (
    <>
      {button}
      <SurahAudioMismatchModal
        open={isMismatchModalVisible}
        currentAudioChapter={getChapterData(currentAudioChapterId)?.nameSimple}
        currentReadingChapter={getChapterData(currentReadingChaptersId[0])?.nameSimple}
        onContinue={withStopPropagation(() => {
          triggerPlayAudio();
          setIsMismatchModalVisible(false);
        })}
        onStartOver={withStopPropagation(() => {
          loadAndPlayAudioFile(Number(currentReadingChaptersId[0]));
          setIsMismatchModalVisible(false);
        })}
      />
    </>
  );
};

export default PlayPauseButton;

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ControlsMenu, { getZoomOutScale, getZoomInScale, calcScaleNum } from './ControlsMenu';

export default function ImagesViewer ({ file, images, dossierInst, contentRef }) {
  const initialState = {
    currentPage: 1, pageText: 1,
    rotate: 0, rotateLoading: null,
    scaleValue: 'pageWidthOption', scaleNum: 1,
  };
  const [state, _setState] = useState(initialState);
  const stateRef = useRef(state); // for event listeners to always get actual state
  const setState = (updates, cb) => {
    _setState(currentState => {
      const newState = { ...currentState, ...updates }; // merge updates with previous state
      stateRef.current = newState; // keep actual state in ref
      if (cb && typeof cb === 'function') { cb(newState); }
      return newState;
    });
  };

  /* mounted */
  useEffect(() => {
    const imgContainer = contentRef.current;
    imgContainer.removeEventListener('scroll', scrollUpdated, true);
    imgContainer.removeEventListener('DOMMouseScroll', onMouseScrollHandler, false);

    imgContainer.addEventListener('scroll', scrollUpdated, true);
    imgContainer.onmousedown = dragToScroll;
    imgContainer.addEventListener('DOMMouseScroll', onMouseScrollHandler, false);
    imgContainer.onmousewheel = onMouseScrollHandler;

    return function cleanup () {
      imgContainer.removeEventListener('scroll', scrollUpdated, true);
      imgContainer.removeEventListener('DOMMouseScroll', onMouseScrollHandler, false);
    };
  }, []);

  /* file changed */
  useEffect(() => {
    resetContainerScroll();
    setState({ ...initialState, rotate: file.rotate || 0 }); // reset state
  }, [file.fileId, file.lastModified]);

  const resetContainerScroll = () => {
    const imgContainer = contentRef.current;
    if (imgContainer) {
      imgContainer.scrollTop = imgContainer.scrollLeft = 0;
    }
  };

  const onMouseScrollHandler = function (e) {
    if (e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
      const { scaleNum } = stateRef.current;
      if (scaleNum) {
        const newScaleNum = (e.deltaY || e.detail) > 0 ? getZoomOutScale(scaleNum) : getZoomInScale(scaleNum);
        setScale(newScaleNum);
      }
    }
  };

  /* on scroll handler */
  const scrollUpdated = (event) => {
    const imgContainer = event.currentTarget;
    const viewTop = imgContainer.scrollTop;
    const viewBottom = viewTop + imgContainer.clientHeight;

    // find visible pages (images)
    const imgs = imgContainer.querySelectorAll('img');
    const visiblePages = [];
    let lastEdge = -1;
    for (let i = 0; i < imgs.length; i++) {
      const img = imgs[i];
      const imgTop = img.offsetTop + img.clientTop; // currentHeight
      const imgHeight = img.clientHeight; // viewHeight
      const imgBottom = imgTop + imgHeight; // viewBottom

      if (lastEdge === -1) {
        if (imgBottom >= viewBottom) {
          lastEdge = imgBottom;
        }
      } else if (imgTop > lastEdge) {
        break;
      }

      if (imgBottom <= viewTop || imgTop >= viewBottom) {
        continue;
      }

      const hiddenHeight = Math.max(0, viewTop - imgTop) + Math.max(0, imgBottom - viewBottom);
      const percent = (imgHeight - hiddenHeight) * 100 / imgHeight | 0;

      visiblePages.push({
        pageNum: i + 1,
        percent,
      });
    }

    if (!visiblePages.length) { return; }
    // calc current page num
    let newPageNum = visiblePages[0].pageNum;
    if (visiblePages[1] && visiblePages[1].percent > visiblePages[0].percent) {
      newPageNum++;
    }

    const { currentPage } = stateRef.current;
    if (newPageNum !== currentPage) {
      setState({ currentPage: newPageNum, pageText: newPageNum }); // page changed
    }
  };

  const dragToScroll = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (document.activeElement) { document.activeElement.blur(); }
    const container = e.currentTarget;
    const startScrollTop = container.scrollTop || 0;
    const startscrollLeft = container.scrollLeft || 0;
    const startX = e.pageX;
    const startY = e.pageY;
    const target = e.currentTarget;
    target.style.cursor = 'grabbing';
    document.body.style.cursor = 'grabbing';

    document.onmousemove = (e) => {
      container.scrollTop = startScrollTop + startY - e.pageY;
      container.scrollLeft = startscrollLeft + startX - e.pageX;
    };

    document.onmouseup = () => {
      target.style.cursor = '';
      document.body.style.cursor = '';
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  const setPage = (event, { value }) => {
    const pageNum = Number(value);
    if (!pageNum || pageNum > images.length) {
      if (document.activeElement) { document.activeElement.blur(); }
    } else {
      const imgContainer = contentRef.current;
      const imgs = imgContainer.querySelectorAll('img');
      if (imgs[pageNum - 1]) {
        imgs[pageNum - 1].scrollIntoView({ block: 'start' });
        setState({ currentPage: pageNum, pageText: pageNum });
      }
    }
  };

  const setPageText = (value) => {
    setState({ pageText: value });
  };


  const setScale = (scale) => {
    const imgContainer = contentRef.current;
    const imgs = imgContainer.querySelectorAll('img');
    const { rotate } = stateRef.current;
    [].forEach.call(imgs, img => {
      setScalePerImg({ img, scale, rotate });
    });
  };

  const setScalePerImg = ({ img, scale, rotate }) => {
    const imgContainer = contentRef.current;
    const { width, height } = window.getComputedStyle(imgContainer);
    const containerSizes = { width: parseFloat(width), height: parseFloat(height) };
    const elementSizes = { width: img.naturalWidth, height: img.naturalHeight };
    const newScaleNum = calcScaleNum({ scale, rotate, containerSizes, elementSizes, numPages: images.length });

    const newWidth = img.naturalWidth * newScaleNum;
    const newHeight = img.naturalHeight * newScaleNum;
    img.style.width = `${newWidth}px`;
    img.style.minWidth = `${newWidth}px`;
    img.style.maxWidth = `${newWidth}px`;
    img.style.height = `${newHeight}px`;
    img.style.minHeight = `${newHeight}px`;

    if (rotate % 180 !== 0) { // 90 or 270
      const marginOffset = (newWidth - newHeight) / 2;
      img.style.margin = `${marginOffset}px ${-marginOffset}px`;
    } else {
      img.style.margin = '';
    }

    // All images might have different sizes, but we must save current scale, so look at first image always
    const firstImage = imgContainer.querySelector('img');
    if (img === firstImage) {
      setState({ scaleValue: scale, scaleNum: newScaleNum });
    }
  };

  const rotateFile = async (angle) => {
    resetContainerScroll();
    const { rotate } = stateRef.current;
    let newAngle = rotate + angle;
    if (newAngle < 0) { newAngle = 270; }
    if (newAngle > 270) { newAngle = 0; }
    setState({
      rotate: newAngle,
      rotateLoading: angle > 0 ? 'CW' : 'CCW', // clockwise / counterclockwise
    }, (newState) => {
      // recalc scale after rotate
      setScale(newState.scaleValue); // NOTE: use scaleValue on rotate
    });
    await dossierInst.saveFileRotation({ dossierFile: file, angle: newAngle });
    setState({ rotateLoading: null });
  };

  const imageOnLoadHandler = (event) => {
    const img = event.target;
    const { scaleValue, rotate } = stateRef.current;
    setScalePerImg({ img, scale: scaleValue, rotate });
  };

  const { currentPage, pageText, scaleValue, scaleNum, rotate, rotateLoading } = state;
  return (
    <React.Fragment>
      <ControlsMenu
        file={file}

        numPages={images.length}
        currentPage={currentPage}
        pageText={pageText}
        setPage={setPage}
        setPageText={setPageText}

        scaleValue={scaleValue} scaleNum={scaleNum} setScale={setScale}
        rotateFile={rotateFile} rotateLoading={rotateLoading}
      />

      <div className="file-dossier-img-container" ref={contentRef}>
        {images.map((image) => (
          <div key={image.name}>
            <img src={image.src} // key={image.src}
              className={`ui fluid image file-dossier-img-rotate${rotate}`}
              onLoad={imageOnLoadHandler}
              // alt="Не удалось отобразить preview файла"
            />
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}

ImagesViewer.propTypes = {
  file: PropTypes.object.isRequired,
  images: PropTypes.array.isRequired,
  dossierInst: PropTypes.object.isRequired,
  contentRef: PropTypes.object.isRequired,
};

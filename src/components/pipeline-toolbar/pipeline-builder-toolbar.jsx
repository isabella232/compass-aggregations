import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { IconButton } from 'hadron-react-buttons';
import { Tooltip } from 'hadron-react-components';
import { Dropdown, MenuItem, Button } from 'react-bootstrap';
import OverviewToggler from './overview-toggler';
import CollationCollapser from './collation-collapser';

import {
  TOOLTIP_EXPORT_TO_LANGUAGE,
  TOOLTIP_CREATE_NEW_PIPELINE,
  TOOLTIP_OPEN_SAVED_PIPELINES
} from '../../constants';

import styles from './pipeline-builder-toolbar.less';

/**
 * The pipeline builder toolbar component.
 */
class PipelineBuilderToolbar extends PureComponent {
  static displayName = 'PipelineBuilderToolbarComponent';

  static propTypes = {
    clonePipeline: PropTypes.func.isRequired,
    exportToLanguage: PropTypes.func.isRequired,
    newPipeline: PropTypes.func.isRequired,
    newPipelineFromText: PropTypes.func.isRequired,

    nameChanged: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,

    setIsModified: PropTypes.func.isRequired,
    isModified: PropTypes.bool.isRequired,

    collationCollapseToggled: PropTypes.func.isRequired,
    isCollationExpanded: PropTypes.bool.isRequired,

    isOverviewOn: PropTypes.bool.isRequired,
    toggleOverview: PropTypes.func.isRequired,

    /**
     * Saved Pipelines
     *
     * TODO (@imlucas) To make this clearer for future travellers:
     * - Rename `savedPipeline` to `savedPipelineList`
     * - Rename `savingPipeline*` to `savePipeline`
     */
    savedPipeline: PropTypes.object.isRequired,
    savedPipelinesListToggle: PropTypes.func.isRequired,
    getSavedPipelines: PropTypes.func.isRequired,
    saveCurrentPipeline: PropTypes.func.isRequired,
    savingPipelineOpen: PropTypes.func.isRequired
  };

  /**
   * Name change event handler.
   *
   * @param {Object} evt
   */
  onNameChange = (evt) => {
    this.props.nameChanged(evt.target.value);
    this.props.setIsModified(true);
  };

  /**
   * Handle clicks on the `Save` button.
   *
   * @returns {void}
   */
  onSaveClicked = () => {
    if (!this.isSavedPipeline()) {
      this.props.savingPipelineOpen();
      return;
    }
    this.props.saveCurrentPipeline();
    this.props.setIsModified(false);
  };

  /**
   * Handle clicks on the `Save As...` MenuItem.
   *
   * @returns {void}
   */
  onSaveAsClicked = () => {
    if (!this.isSavedPipeline()) {
      this.onSaveClicked();
      return;
    }
    this.props.savingPipelineOpen({ name: this.props.name, isSaveAs: true });
  };

  handleSavedPipelinesOpen = () => {
    this.props.getSavedPipelines();
    this.props.savedPipelinesListToggle(1);
  };

  handleSavedPipelinesClose = () => {
    this.props.savedPipelinesListToggle(0);
  };

  /**
   * Is the current pipeline already saved?
   * @returns {Boolean}
   */
  isSavedPipeline() {
    return this.props.name !== '';
  }

  modifiedText() {
    if (!this.props.isModified) {
      return null;
    }
    return <span>Modified</span>;
  }

  renderIsModifiedIndicator() {
    const isModifiedClassName = classnames({
      [styles['is-modified']]: true,
      [styles['is-modified-on']]: this.props.isModified
    });
    if (!this.props.isModified) {
      return null;
    }
    return (
      <div className={isModifiedClassName}>
        - <span>Modified</span>
      </div>
    );
  }

  /**
   * Renders the pipeline builder toolbar.
   *
   * @returns {React.Component} The component.
   */
  render() {
    const clickHandler = this.props.savedPipeline.isListVisible
      ? this.handleSavedPipelinesClose
      : this.handleSavedPipelinesOpen;

    const savePipelineClassName = classnames({
      btn: true,
      'btn-xs': true,
      'btn-primary': true,
      [styles['pipeline-builder-toolbar-save-pipeline-button']]: true
    });

    return (
      <div className={classnames(styles['pipeline-builder-toolbar'])}>
        <OverviewToggler
          isOverviewOn={this.props.isOverviewOn}
          toggleOverview={this.props.toggleOverview}
        />
        <span
          data-tip={TOOLTIP_OPEN_SAVED_PIPELINES}
          data-for="open-saved-pipelines"
          data-place="top"
          data-html="true">
          <IconButton
            title="Toggle Saved Pipelines"
            className={classnames(
              'btn',
              'btn-xs',
              'btn-default',
              styles['pipeline-builder-toolbar-open-saved-pipelines-button']
            )}
            iconClassName="fa fa-folder-open-o"
            clickHandler={clickHandler}
          />
          <Tooltip id="open-saved-pipelines" />
        </span>
        <div>
          <Dropdown id="new-pipeline-actions" className="btn-group">
            <span
              data-tip={TOOLTIP_CREATE_NEW_PIPELINE}
              data-for="create-new-pipeline"
              data-place="top"
              data-html="true">
              <Button
                variant="default"
                className={classnames(
                  'btn-xs',
                  styles['pipeline-builder-toolbar-new-button']
                )}
                onClick={this.props.newPipeline}>
                <i className="fa fa-plus-circle" />
              </Button>
            </span>
            <Tooltip id="create-new-pipeline" />
            <Dropdown.Toggle className="btn-default btn-xs btn" />

            <Dropdown.Menu>
              <MenuItem onClick={this.props.newPipelineFromText}>
                New Pipeline From Text
              </MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <CollationCollapser
          isCollationExpanded={this.props.isCollationExpanded}
          collationCollapseToggled={this.props.collationCollapseToggled}
        />
        <div
          className={classnames(
            styles['pipeline-builder-toolbar-add-wrapper']
          )}>
          <div className={styles['pipeline-builder-toolbar-name']}>
            {this.props.name || 'Untitled'}
          </div>
          {this.renderIsModifiedIndicator()}
        </div>
        <div>
          <Dropdown id="save-pipeline-actions">
            <Button
              className={savePipelineClassName}
              variant="primary"
              onClick={this.onSaveClicked.bind(this)}>
              Save
            </Button>

            <Dropdown.Toggle className="btn-xs btn btn-primary" />

            <Dropdown.Menu>
              <MenuItem onClick={this.onSaveAsClicked.bind(this)}>
                Save pipeline as&hellip;
              </MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div
          className={styles['pipeline-builder-toolbar-export-to-language']}
          data-tip={TOOLTIP_EXPORT_TO_LANGUAGE}
          data-for="export-to-language"
          data-place="top"
          data-html="true">
          <IconButton
            className="btn btn-xs btn-default"
            iconClassName={classnames(styles['export-icon'])}
            clickHandler={this.props.exportToLanguage}
            title="Export To Language"
          />
          <Tooltip id="export-to-language" />
        </div>
      </div>
    );
  }
}

export default PipelineBuilderToolbar;

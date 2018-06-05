import { exportToLanguage, generateText } from 'modules/export-to-language';

describe('export-to-language module', () => {
  describe('#exportToLanguage', () => {
    it('returns the export to language thunk', () => {
      expect(exportToLanguage()).to.be.a('function');
    });
  });

  describe('#generateText', () => {
    context('when the stages are enabled', () => {
      const state = {
        pipeline: [{
          isEnabled: true,
          stageOperator: '$match',
          stage: '{ name: "testing" }'
        }]
      };

      it('returns the generated text', () => {
        expect(generateText(state)).to.equal('[{ $match: { name: "testing" } }]');
      });
    });

    context('when a stage is not enabled', () => {
      context('when there is only a single stage', () => {
        const state = {
          pipeline: [{
            isEnabled: false,
            stageOperator: '$match',
            stage: '{ name: "testing" }'
          }]
        };

        it('returns an empty array string', () => {
          expect(generateText(state)).to.equal('[]');
        });
      });

      context('when there are multiple stages', () => {
        const state = {
          pipeline: [
            {
              isEnabled: false,
              stageOperator: '$match',
              stage: '{ name: "testing" }'
            },
            {
              isEnabled: false,
              stageOperator: '$match',
              stage: '{ name: "testing" }'
            },
            {
              isEnabled: true,
              stageOperator: '$match',
              stage: '{ name: "testing" }'
            }
          ]
        };

        it('does not include commas for disabled stages', () => {
          expect(generateText(state)).to.equal('[{ $match: { name: "testing" } }]');
        });
      });
    });

    context('when a stage has no stage operator', () => {
      const state = {
        pipeline: [{
          isEnabled: true,
          stageOperator: null,
          stage: '{ name: "testing" }'
        }]
      };

      it('returns an empty array string', () => {
        expect(generateText(state)).to.equal('[]');
      });
    });

    context('when there are multiple stages', () => {
      const state = {
        pipeline: [
          {
            isEnabled: true,
            stageOperator: '$match',
            stage: '{ name: "testing" }'
          },
          {
            isEnabled: true,
            stageOperator: '$project',
            stage: '{ name: 1 }'
          }
        ]
      };

      it('separates each stage with a comma', () => {
        expect(generateText(state)).to.equal(
          '[{ $match: { name: "testing" } }, { $project: { name: 1 } }]'
        );
      });
    });
  });
});
import _ from 'underscore';
import Worker from './Worker';

const SCORE_RANGE = 6;
const BASE_PROB = 0.8;

const Hiring = {
  availableWorkers: function(player, company) {
    return _.filter(player.workers, function(w) {
      return w.offMarketTime === 0 && (!_.contains(company.workers, w) || w.robot);
    });
  },
  recruit: function(recruitment, player, company) {
    var self = this,
        pool = _.map(this.availableWorkers(player, company), function(w) {
          return w.robot ? _.clone(w) : w;
        });
    var candidates = _.filter(pool, function(worker) {
      var score = self.score(worker),
          targetScore = recruitment.targetScore,
          prob = BASE_PROB;
      if (score <= targetScore - SCORE_RANGE || score >= targetScore + SCORE_RANGE) {
        prob = 0;
      } else {
        prob -= Math.abs((targetScore - score)/targetScore)/2;
      }
      return (worker.robot == recruitment.robots && Math.random() <= prob);
    });
    if (candidates.length >= 2) {
      return _.sample(candidates, _.random(1, candidates.length/2));
    }
    return candidates;
  },
  score: function(worker) {
    return Math.floor(
      Worker.design(worker) +
      Worker.engineering(worker) +
      Worker.marketing(worker) +
      Worker.productivity(worker));
  },
};

export default Hiring;

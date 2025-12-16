def heuristic_score(signals: dict)->float:
    score=0.5
    if signals["all_caps_ratio"] > 0.3:
        score -= 0.15
    if signals["exclamation_count"] > 5:
        score -= 0.15
    if signals["length"] < 100:
        score -= 0.1
    return max(0, min(1, score))
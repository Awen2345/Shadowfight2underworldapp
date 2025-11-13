export interface BattleState {
  bossId: string;
  bossCurrentShield: number;
  bossMaxShield: number;
  currentRound: number;
  maxRounds: number;
  timeRemaining: number;
  playerHealth: number;
  playerMaxHealth: number;
  activeElixirs: ActiveElixir[];
  damageDealt: number;
  damageReceived: number;
  hits: number;
  magicCharge: number;
  isComplete: boolean;
  isVictory: boolean;
}

export interface ActiveElixir {
  elixirId: string;
  roundsRemaining: number;
  effects: ElixirEffect[];
}

export interface ElixirEffect {
  type: 'magic_boost' | 'damage_reflect' | 'knockback_immunity' | 'health_regen' | 'bomb_effect' | 'enchantment_reduction';
  value?: number; // percentage or amount
}

export interface ChargeEffect {
  minDamage: number;
  maxDamage: number;
}

export interface BattleLog {
  timestamp: number;
  type: 'player_attack' | 'boss_attack' | 'charge_used' | 'elixir_used' | 'effect_triggered' | 'round_end' | 'battle_end';
  message: string;
  damage?: number;
}

// Charge damages
export const chargeEffects: Record<string, ChargeEffect> = {
  'minor-charge': { minDamage: 72, maxDamage: 88 },
  'medium-charge': { minDamage: 488, maxDamage: 551 },
  'large-charge': { minDamage: 990, maxDamage: 1071 }
};

// Elixir effects configuration
export const elixirEffects: Record<string, ElixirEffect[]> = {
  'magic-source': [
    { type: 'magic_boost', value: 50 } // 50% increased magic gain
  ],
  'steel-hedgehog': [
    { type: 'damage_reflect', value: 30 } // Reflects 30% of damage received
  ],
  'crag': [
    { type: 'knockback_immunity', value: 100 } // 100% immunity to knockback
  ],
  'healing-vine': [
    { type: 'health_regen', value: 5 } // 5% health regen per second
  ],
  'phoenix': [
    { type: 'knockback_immunity', value: 100 },
    { type: 'damage_reflect', value: 20 },
    { type: 'magic_boost', value: 30 }
  ],
  'explosive-vigor': [
    { type: 'bomb_effect', value: 150 } // 150% damage with bomb effect
  ],
  'star-clarity': [
    { type: 'enchantment_reduction', value: 70 } // 70% reduction in enemy enchantment proc
  ]
};

export class BattleSimulator {
  private state: BattleState;
  private logs: BattleLog[] = [];
  
  constructor(bossId: string, bossShield: number, timeLimit: string) {
    const [minutes, seconds] = timeLimit.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;
    
    this.state = {
      bossId,
      bossCurrentShield: bossShield,
      bossMaxShield: bossShield,
      currentRound: 1,
      maxRounds: 3,
      timeRemaining: totalSeconds,
      playerHealth: 1000,
      playerMaxHealth: 1000,
      activeElixirs: [],
      damageDealt: 0,
      damageReceived: 0,
      hits: 0,
      magicCharge: 0,
      isComplete: false,
      isVictory: false
    };
  }

  getState(): BattleState {
    return { ...this.state };
  }

  getLogs(): BattleLog[] {
    return [...this.logs];
  }

  private addLog(type: BattleLog['type'], message: string, damage?: number) {
    this.logs.push({
      timestamp: Date.now(),
      type,
      message,
      damage
    });
  }

  // Use a charge of darkness
  useCharge(chargeId: string): boolean {
    if (this.state.isComplete) return false;
    
    const effect = chargeEffects[chargeId];
    if (!effect) return false;

    const damage = Math.floor(Math.random() * (effect.maxDamage - effect.minDamage + 1)) + effect.minDamage;
    this.dealDamageToBoss(damage);
    
    this.addLog('charge_used', `Used ${chargeId.replace('-', ' ')}!`, damage);
    return true;
  }

  // Use an elixir
  useElixir(elixirId: string): boolean {
    if (this.state.isComplete) return false;
    
    const effects = elixirEffects[elixirId];
    if (!effects) return false;

    // Check if this elixir is already active
    const alreadyActive = this.state.activeElixirs.find(e => e.elixirId === elixirId);
    if (alreadyActive) {
      this.addLog('elixir_used', `${elixirId} is already active!`);
      return false;
    }

    this.state.activeElixirs.push({
      elixirId,
      roundsRemaining: 1, // All elixirs last 1 round
      effects
    });

    this.addLog('elixir_used', `Activated ${elixirId.replace('-', ' ')}!`);
    return true;
  }

  // Player performs a basic attack
  playerAttack(): number {
    if (this.state.isComplete) return 0;

    // Base damage with some randomness
    let baseDamage = Math.floor(Math.random() * 50) + 80; // 80-130 base damage
    
    // Apply explosive vigor effect
    const explosiveVigor = this.state.activeElixirs.find(e => 
      e.effects.some(eff => eff.type === 'bomb_effect')
    );
    
    if (explosiveVigor) {
      const bombEffect = explosiveVigor.effects.find(e => e.type === 'bomb_effect');
      if (bombEffect && bombEffect.value) {
        baseDamage = Math.floor(baseDamage * (bombEffect.value / 100));
        this.addLog('effect_triggered', `Bomb effect! Damage increased!`);
      }
    }

    this.dealDamageToBoss(baseDamage);
    this.state.hits++;
    
    // Gain magic charge (affected by magic boost)
    let magicGain = 10;
    const magicBoost = this.state.activeElixirs.find(e =>
      e.effects.some(eff => eff.type === 'magic_boost')
    );
    
    if (magicBoost) {
      const boost = magicBoost.effects.find(e => e.type === 'magic_boost');
      if (boost && boost.value) {
        magicGain = Math.floor(magicGain * (1 + boost.value / 100));
      }
    }
    
    this.state.magicCharge = Math.min(100, this.state.magicCharge + magicGain);
    
    this.addLog('player_attack', `You dealt ${baseDamage} damage!`, baseDamage);
    return baseDamage;
  }

  // Boss attacks player
  bossAttack(): number {
    if (this.state.isComplete) return 0;

    // Boss base damage
    let bossDamage = Math.floor(Math.random() * 80) + 60; // 60-140 damage
    
    // Check for enchantment reduction
    const starClarity = this.state.activeElixirs.find(e =>
      e.effects.some(eff => eff.type === 'enchantment_reduction')
    );
    
    if (starClarity) {
      // Random chance that boss enchantment doesn't trigger
      const reduction = starClarity.effects.find(e => e.type === 'enchantment_reduction');
      if (reduction && reduction.value) {
        const chance = Math.random() * 100;
        if (chance < reduction.value) {
          bossDamage = Math.floor(bossDamage * 0.5); // Reduced damage
          this.addLog('effect_triggered', `Star Clarity reduced enemy enchantment!`);
        }
      }
    }

    // Apply damage to player
    this.state.playerHealth = Math.max(0, this.state.playerHealth - bossDamage);
    this.state.damageReceived += bossDamage;
    
    // Check for damage reflection
    const steelHedgehog = this.state.activeElixirs.find(e =>
      e.effects.some(eff => eff.type === 'damage_reflect')
    );
    
    if (steelHedgehog) {
      const reflect = steelHedgehog.effects.find(e => e.type === 'damage_reflect');
      if (reflect && reflect.value) {
        const reflectedDamage = Math.floor(bossDamage * (reflect.value / 100));
        this.dealDamageToBoss(reflectedDamage);
        this.addLog('effect_triggered', `Steel Hedgehog reflected ${reflectedDamage} damage!`, reflectedDamage);
      }
    }
    
    // Gain magic when hit (affected by magic boost)
    let magicGain = 15;
    const magicBoost = this.state.activeElixirs.find(e =>
      e.effects.some(eff => eff.type === 'magic_boost')
    );
    
    if (magicBoost) {
      const boost = magicBoost.effects.find(e => e.type === 'magic_boost');
      if (boost && boost.value) {
        magicGain = Math.floor(magicGain * (1 + boost.value / 100));
      }
    }
    
    this.state.magicCharge = Math.min(100, this.state.magicCharge + magicGain);
    
    this.addLog('boss_attack', `Boss dealt ${bossDamage} damage to you!`, bossDamage);
    
    // Check if player is defeated
    if (this.state.playerHealth <= 0) {
      this.endBattle(false);
    }
    
    return bossDamage;
  }

  // Apply healing from healing vine
  applyHealing() {
    const healingVine = this.state.activeElixirs.find(e =>
      e.effects.some(eff => eff.type === 'health_regen')
    );
    
    if (healingVine) {
      const regen = healingVine.effects.find(e => e.type === 'health_regen');
      if (regen && regen.value) {
        const healAmount = Math.floor(this.state.playerMaxHealth * (regen.value / 100));
        this.state.playerHealth = Math.min(this.state.playerMaxHealth, this.state.playerHealth + healAmount);
        this.addLog('effect_triggered', `Healing Vine restored ${healAmount} HP!`);
      }
    }
  }

  private dealDamageToBoss(damage: number) {
    this.state.bossCurrentShield = Math.max(0, this.state.bossCurrentShield - damage);
    this.state.damageDealt += damage;
    
    if (this.state.bossCurrentShield <= 0) {
      this.endBattle(true);
    }
  }

  // End current round
  endRound() {
    if (this.state.isComplete) return;
    
    // Decrease elixir durations
    this.state.activeElixirs = this.state.activeElixirs.filter(elixir => {
      elixir.roundsRemaining--;
      if (elixir.roundsRemaining <= 0) {
        this.addLog('effect_triggered', `${elixir.elixirId} effect has worn off.`);
        return false;
      }
      return true;
    });
    
    this.state.currentRound++;
    
    if (this.state.currentRound > this.state.maxRounds) {
      this.endBattle(this.state.bossCurrentShield <= 0);
    } else {
      this.addLog('round_end', `Round ${this.state.currentRound - 1} ended. Starting Round ${this.state.currentRound}`);
    }
  }

  private endBattle(victory: boolean) {
    this.state.isComplete = true;
    this.state.isVictory = victory;
    
    if (victory) {
      this.addLog('battle_end', `Victory! You defeated the boss!`);
    } else {
      this.addLog('battle_end', `Defeat! ${this.state.bossCurrentShield > 0 ? 'Boss survived' : 'You were defeated'}.`);
    }
  }

  // Simulate one turn of combat
  simulateTurn() {
    if (this.state.isComplete) return;
    
    // Player attacks
    this.playerAttack();
    
    if (!this.state.isComplete) {
      // Boss counter-attacks
      this.bossAttack();
    }
    
    // Apply healing effects
    this.applyHealing();
    
    // Decrease time
    this.state.timeRemaining = Math.max(0, this.state.timeRemaining - 2);
    
    if (this.state.timeRemaining <= 0) {
      this.endBattle(this.state.bossCurrentShield <= 0);
    }
  }
}

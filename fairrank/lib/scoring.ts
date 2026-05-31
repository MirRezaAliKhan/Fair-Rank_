/**
 * Universal Standard Score (USS) Calculation Engine
 * Calculates student scores based on academics, skills, projects, experience, and behavioral indicators
 * with trust-aware weighting for verified vs self-reported data
 */

interface StudentData {
  cgpa: { value: number; verified: boolean };
  skills: Array<{
    name: string;
    proficiency: string;
    verified: boolean;
    assessmentScore?: number;
  }>;
  projects: Array<{
    title: string;
    technologies: string[];
    githubLink?: string;
    highlights: string[];
  }>;
  experience: Array<{
    title: string;
    duration: string;
    description: string;
  }>;
  socialLinks: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
}

interface Weights {
  academics: number;
  skills: number;
  projects: number;
  experience: number;
  behavioral: number;
}

interface USSResult {
  score: number;
  confidence: number;
  breakdown: {
    academics: { score: number; weight: number; trust: number };
    skills: { score: number; weight: number; trust: number };
    projects: { score: number; weight: number; trust: number };
    experience: { score: number; weight: number; trust: number };
    behavioral: { score: number; weight: number; trust: number };
  };
  suggestions: Array<{
    category: string;
    suggestion: string;
    potentialImpact: number;
  }>;
}

const DEFAULT_WEIGHTS: Weights = {
  academics: 0.2,
  skills: 0.3,
  projects: 0.25,
  experience: 0.15,
  behavioral: 0.1,
};

/**
 * Calculate trust level for a score (0-1)
 * Verified data gets 1.0 trust, self-reported gets 0.6
 */
function calculateTrustLevel(verified: boolean): number {
  return verified ? 1.0 : 0.6;
}

/**
 * Calculate academics score (0-100)
 * Based on CGPA (0-10 scale), trust-adjusted
 */
function calculateAcademicsScore(cgpa: { value: number; verified: boolean }): {
  score: number;
  trust: number;
} {
  const normalizedCGPA = Math.min(cgpa.value / 10, 1) * 100; // Convert 0-10 to 0-100
  const trust = calculateTrustLevel(cgpa.verified);
  const trustAdjustedScore = normalizedCGPA * trust;

  return {
    score: trustAdjustedScore,
    trust,
  };
}

/**
 * Calculate skills score (0-100)
 * Based on proficiency levels and assessment scores
 */
function calculateSkillsScore(skills: StudentData['skills']): {
  score: number;
  trust: number;
} {
  if (skills.length === 0) {
    return { score: 0, trust: 0 };
  }

  const proficiencyScores: { [key: string]: number } = {
    beginner: 25,
    intermediate: 50,
    advanced: 75,
    expert: 100,
  };

  let totalScore = 0;
  let totalTrust = 0;

  skills.forEach((skill) => {
    let skillScore = proficiencyScores[skill.proficiency] || 0;

    // If assessment score exists, blend with proficiency
    if (skill.assessmentScore !== undefined) {
      skillScore = (skillScore + skill.assessmentScore) / 2;
    }

    const trust = calculateTrustLevel(skill.verified || skill.assessmentScore !== undefined);
    totalScore += skillScore * trust;
    totalTrust += trust;
  });

  const avgTrust = totalTrust / skills.length;
  const avgScore = totalScore / skills.length;

  return {
    score: avgScore,
    trust: avgTrust,
  };
}

/**
 * Calculate projects score (0-100)
 * Based on number of projects, complexity, and verified links
 */
function calculateProjectsScore(
  projects: StudentData['projects'],
  githubProfile?: string
): { score: number; trust: number } {
  if (projects.length === 0) {
    return { score: 0, trust: 0 };
  }

  let baseScore = Math.min(projects.length * 20, 80); // 20 points per project, max 80

  let trust = 0.6; // Default trust for self-reported projects

  // Bonus for verified GitHub projects
  const verifiedProjects = projects.filter((p) => p.githubLink && githubProfile);
  if (verifiedProjects.length > 0) {
    baseScore = Math.min(baseScore + verifiedProjects.length * 10, 100);
    trust = 0.9; // Higher trust for GitHub-verified projects
  }

  // Bonus for diverse tech stack
  const allTechs = new Set(projects.flatMap((p) => p.technologies));
  if (allTechs.size >= 5) {
    baseScore = Math.min(baseScore + 10, 100);
  }

  return {
    score: baseScore,
    trust,
  };
}

/**
 * Calculate experience score (0-100)
 * Based on number of positions and duration
 */
function calculateExperienceScore(experience: StudentData['experience']): {
  score: number;
  trust: number;
} {
  if (experience.length === 0) {
    return { score: 0, trust: 0.6 };
  }

  let baseScore = Math.min(experience.length * 25, 100);

  // Bonus for total cumulative experience
  // This is a simplified calculation; in production, parse duration strings
  const totalPositions = experience.length;
  if (totalPositions >= 3) {
    baseScore = Math.min(baseScore + 15, 100);
  }

  return {
    score: baseScore,
    trust: 0.7, // Moderate trust for self-reported experience
  };
}

/**
 * Calculate behavioral score (0-100)
 * Based on social profiles and activity indicators
 */
function calculateBehavioralScore(socialLinks: StudentData['socialLinks']): {
  score: number;
  trust: number;
} {
  let baseScore = 0;
  let verifiedProfiles = 0;

  if (socialLinks.github) {
    baseScore += 30;
    verifiedProfiles++;
  }

  if (socialLinks.linkedin) {
    baseScore += 30;
    verifiedProfiles++;
  }

  if (socialLinks.portfolio) {
    baseScore += 20;
  }

  // Trust is higher with verified social profiles
  const trust = verifiedProfiles > 0 ? 0.85 : 0.5;

  return {
    score: baseScore,
    trust,
  };
}

/**
 * Calculate Universal Standard Score (USS)
 * Main function that combines all components with weighted scoring
 */
export function calculateUSS(
  studentData: StudentData,
  customWeights?: Weights
): USSResult {
  const weights = customWeights || DEFAULT_WEIGHTS;

  // Calculate individual scores
  const academics = calculateAcademicsScore(studentData.cgpa);
  const skills = calculateSkillsScore(studentData.skills);
  const projects = calculateProjectsScore(studentData.projects, studentData.socialLinks.github);
  const experience = calculateExperienceScore(studentData.experience);
  const behavioral = calculateBehavioralScore(studentData.socialLinks);

  // Calculate weighted score
  const weightedScore =
    academics.score * weights.academics +
    skills.score * weights.skills +
    projects.score * weights.projects +
    experience.score * weights.experience +
    behavioral.score * weights.behavioral;

  // Calculate confidence based on data completeness and trust
  const dataCompleteness = (
    (studentData.cgpa.value > 0 ? 1 : 0) +
    (studentData.skills.length > 0 ? 1 : 0) +
    (studentData.projects.length > 0 ? 1 : 0) +
    (studentData.experience.length > 0 ? 1 : 0) +
    (Object.keys(studentData.socialLinks).filter((k) => studentData.socialLinks[k as keyof typeof studentData.socialLinks]).length > 0 ? 1 : 0)
  ) / 5;

  const avgTrust = (academics.trust + skills.trust + projects.trust + experience.trust + behavioral.trust) / 5;
  const confidence = Math.round(dataCompleteness * avgTrust * 100);

  // Generate improvement suggestions
  const suggestions = generateSuggestions({
    academics: academics.score,
    skills: skills.score,
    projects: projects.score,
    experience: experience.score,
    behavioral: behavioral.score,
  });

  return {
    score: Math.round(weightedScore),
    confidence,
    breakdown: {
      academics: { score: Math.round(academics.score), weight: weights.academics, trust: academics.trust },
      skills: { score: Math.round(skills.score), weight: weights.skills, trust: skills.trust },
      projects: { score: Math.round(projects.score), weight: weights.projects, trust: projects.trust },
      experience: { score: Math.round(experience.score), weight: weights.experience, trust: experience.trust },
      behavioral: { score: Math.round(behavioral.score), weight: weights.behavioral, trust: behavioral.trust },
    },
    suggestions,
  };
}

/**
 * Generate personalized improvement suggestions
 */
function generateSuggestions(scores: {
  academics: number;
  skills: number;
  projects: number;
  experience: number;
  behavioral: number;
}): Array<{ category: string; suggestion: string; potentialImpact: number }> {
  const suggestions: Array<{ category: string; suggestion: string; potentialImpact: number }> = [];

  if (scores.academics < 50) {
    suggestions.push({
      category: 'Academics',
      suggestion: 'Focus on improving your CGPA by excelling in key courses. Consider taking advanced electives to diversify your technical knowledge.',
      potentialImpact: 15,
    });
  }

  if (scores.skills < 50) {
    suggestions.push({
      category: 'Skills',
      suggestion: 'Complete skill assessments on the platform to verify your expertise. Consider learning trending technologies in your domain.',
      potentialImpact: 20,
    });
  }

  if (scores.projects < 50) {
    suggestions.push({
      category: 'Projects',
      suggestion: 'Build and showcase projects on GitHub. Aim for at least 3-4 significant projects with diverse technology stacks.',
      potentialImpact: 25,
    });
  }

  if (scores.experience < 50) {
    suggestions.push({
      category: 'Experience',
      suggestion: 'Pursue internships or freelance projects to gain practical experience. Document your accomplishments clearly.',
      potentialImpact: 20,
    });
  }

  if (scores.behavioral < 50) {
    suggestions.push({
      category: 'Professional Presence',
      suggestion: 'Build your professional network. Maintain active GitHub, LinkedIn, and portfolio profiles to increase visibility.',
      potentialImpact: 15,
    });
  }

  return suggestions;
}

/**
 * Recalculate USS with custom weights (for recruiter's perspective)
 */
export function calculateUSSWithCustomWeights(
  studentData: StudentData,
  weights: Weights
): USSResult {
  return calculateUSS(studentData, weights);
}
